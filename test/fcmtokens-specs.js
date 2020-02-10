/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('fcmtokens', () => {
  context('GET /fcmtokens/participant/:fbid', () => {
    it('should return 204 if no fcmtoken with fbid=fbid', async () => {
      await koaRequest
        .get('/fcmtokens/participant/' + 'fbid')
        .expect(204)
    })
    it('should return fcmtoken for participant fbid=fbid', async () => {
      let p2 = await models.db.participant.create({fbid: 'fbid'})
      let f1 = await models.db.fcmtoken.create({
        fcm_token: 'token1',
        participant_id: p2.id})
      await koaRequest
        .get('/fcmtokens/participant/' + p2.fbid)
        .expect(200)
        .then(response => {
          response.body.fcm_token.should.equal(f1.fcm_token)
          response.body.participant_id.should.equal(p2.id)
        })
    })
  })
  context('GET /fcmtokens/:id', () => {
    it('should return 204 if no fcmtoken with id=id', async () => {
      await koaRequest
        .get('/fcmtokens/1')
        .expect(204)
    })
    it('should return fcmtoken with id=id', async () => {
      let f1 = await models.db.fcmtoken.create({
        fcm_token: 'token1'
      })
      await koaRequest
        .get('/fcmtokens/' + f1.id)
        .expect(200)
        .then(response => {
          response.body.fcm_token.should.equal(f1.fcm_token)
        })
    })
  })
  context('GET /fcmtokens/token/:token', () => {
    it('should return 204 if no fcmtoken with fcm_token=token', async () => {
      await koaRequest
        .get('/fcmtokens/token/token1')
        .expect(204)
    })

    it('should return fcmtoken with fcm_token=token', async () => {
      let f1 = await models.db.fcmtoken.create({
        fcm_token: 'token1'
      })
      await koaRequest
        .get('/fcmtokens/token/' + f1.fcm_token)
        .expect(200)
        .then(response => {
          response.body.fcm_token.should.equal(f1.fcm_token)
        })
    })
  })
  context('GET /fcmtokensall', () => {
    it('should return fcmtokens', async () => {
      let f1 = await models.db.fcmtoken.create({
        fcm_token: 'token1'
      })
      let f2 = await models.db.fcmtoken.create({
        fcm_token: 'token2'
      })
      await koaRequest
        .get('/fcmtokensall')
        .expect(200)
        .then(response => {
          response.body[0].fcm_token.should.equal(f1.fcm_token)
          response.body[1].fcm_token.should.equal(f2.fcm_token)
        })
    })
  })
  context('POST /fcmtokens', () => {
    it('should create fcmtoken with fcm_token=token', async () => {
      let token1 = 'token1'
      await koaRequest
        .post('/fcmtokens')
        .send({
          fcm_token: token1
        })
        .expect(201)
        .then(response => {
          response.body.fcm_token.should.equal(token1)
        })
    })
    it('should create fcmtoken with fcm_token=fcmTokenVal, fbid=fbid', async () => {
      let fbid = 'fbid1'
      let p1 = await models.db.participant.create({fbid: fbid})
      let token2 = 'token2'
      await koaRequest
        .post('/fcmtokens')
        .send({
          fcm_token: token2,
          fbid: p1.fbid
        })
        .expect(201)
        .then(response => {
          response.body.fcm_token.should.equal(token2)
          response.body.participant_id.should.equal(p1.id)
        })
    })

    it('should return 409 if fcmtoken fcm_token conflict', async () => {
      let token3 = 'token3'
      let f1 = await models.db.fcmtoken.create({fcm_token: token3})
      await koaRequest
        .post('/fcmtokens')
        .send({
          fcm_token: f1.fcm_token
        })
        .expect(409, {'error': {
          'code': 409,
          'message': `fcmtoken with fcm_token "${f1.fcm_token}" already exists`
        }})
    })

    it('should return 409 if fbid already has a fcm_token', async () => {
      let fbid2 = 'fbid2'
      let p2 = await models.db.participant.create({fbid: fbid2})
      let token4 = 'token4'
      let f2 = await models.db.fcmtoken.create({
        fcm_token: token4,
        participant_id: p2.id
      })
      if (f2) {
        let token5 = 'token5'
        await koaRequest
          .post('/fcmtokens')
          .send({
            fcm_token: token5,
            fbid: p2.fbid
          })
          .expect(409, {'error': {
            'code': 409,
            'message': `fcmtoken already exists for fbid "${p2.fbid}"`
          }})
      }
    })
  })

  context('PATCH /fcmtokens/:id', () => {
    it('should change fcmtoken fcm_token', async () => {
      let f1 = await models.db.fcmtoken.create({
        fcm_token: 'token1'
      })
      await koaRequest
        .patch('/fcmtokens/' + f1.id)
        .send({
          fcm_token: 'token2',
          fbid: 'fbid_u1'
        })
        .expect(200, [1])
    })
    it('should return 400 if no fcmtoken with id=id', async () => {
      await koaRequest
        .patch('/fcmtokens/' + 1)
        .send({fcm_token: 'token1'})
        .expect(400, [0])
    })
    it('should return 400 if fcmtoken fcm_token conflict', async () => {
      let f2 = await models.db.fcmtoken.create({
        fcm_token: 'token2'
      })
      let f3 = await models.db.fcmtoken.create({
        fcm_token: 'token3'
      })
      await koaRequest
        .patch('/fcmtokens/' + f2.id)
        .send({fcm_token: f3.fcm_token})
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

  context('PATCH /fcmtokens/token/:token', () => {
    it('should assign participant_id to fcmtoken fcm_token=token', async () => {
      let token1 = 'token1'
      let f1 = await models.db.fcmtoken.create({ fcm_token: token1 })
      if (f1) {
        let p1 = await models.db.participant.create({fbid: 'fbid1'})
        let token2 = 'token2'
        await koaRequest
          .patch('/fcmtokens/token/' + f1.fcm_token)
          .send({
            fbid: p1.fbid,
            fcm_token: token1
          })
          .expect(200, [1])
          let f2 = await models.db.fcmtoken.findById(f1.id)
          f2.fcm_token.should.equal(token1)
          f2.participant_id.should.equal(p1.id)
      }
    })
    it('should return 400 if no fcmtoken with token=token', async () => {
      let token = 'test'
      await koaRequest
        .patch('/fcmtokens/token/' + token)
        .send({fcm_token: token})
        .expect(400, {'error': {
          'code': 400,
          'message': `fcmtoken "${token}" does not exist`
        }})
    })
  })

  context('PATCH /fcmtokens/participant/:fbid', () => {
    it('should updat fcmtoken fcm_token for participant fbid=fbid', async () => {
      let fbid = 'fbid1'
      let p1 = await models.db.participant.create({fbid: fbid})
      let f1 = await models.db.fcmtoken.create({
        fcm_token: 'token1',
        participant_id: p1.id
      })
      if (f1) {
        let token2 = 'token2'
        await koaRequest
          .patch('/fcmtokens/participant/' + p1.fbid)
          .send({
            fcm_token: token2
          })
          .expect(200, [1])
          let f2 = await models.db.fcmtoken.findById(f1.id)
          f2.fcm_token.should.equal(token2)
          f2.participant_id.should.equal(p1.id)
      }
    })
    it('should return 400 if no participant fbid=fbid', async () => {
      let token = 'test'
      let fbid = 'fbidtest1'
      await koaRequest
        .patch('/fcmtokens/participant/' + fbid)
        .send({fcm_token: token})
        .expect(400, {'error': {
          'code': 400,
          'message': `participant with fbid "${fbid}" does not exist`
        }})
    })
    it('should return 400 if no participant fbid=fbid', async () => {
      let token = 'test'
      let fbid = 'fbidtest1'
      let p1 = await models.db.participant.create({fbid: fbid})
      await koaRequest
        .patch('/fcmtokens/participant/' + p1.fbid)
        .send({fcm_token: token})
        .expect(400, {'error': {
          'code': 400,
          'message': `fcmtoken for fbid "${fbid}" does not exist`
        }})
  })
})
  context('DELETE /fcmtokens/:id', () => {
    it('should delete fcmtoken with id=id', async () => {
      let fcmtoken = await models.db.fcmtoken.create({
        fcm_token: 'fcmTokenVal'
      })
      await koaRequest
        .del('/fcmtokens/' + fcmtoken.id)
        .expect(204)
    })
    it('should return 400 if no fcmtoken with id=id', async () => {
      await koaRequest
        .del('/fcmtokens/' + 0)
        .expect(400)
    })
  })

  context('DELETE /fcmtokens/participant/:fbid', () => {
    it('should delete fcmtoken for participant with fbid=fbid', async () => {
      let fbid = 'fbid_d1'
      let p1 = await models.db.participant.create({fbid: fbid})
      let token1 = 'token1'
      let fcmtoken = await models.db.fcmtoken.create({
        fcm_token: token1,
        participant_id: p1.id
      })
      if (fcmtoken) {
        await koaRequest
          .del('/fcmtokens/participant/' + p1.fbid)
          .expect(204)
      }
    })
    it('should return 400 if no fcm_token for participant with fbid=fbid', async () => {
      let fbid = 'fbi_d2'
      await koaRequest
        .del('/fcmtokens/participant/' + fbid)
        .expect(400)
    })
  })
})
