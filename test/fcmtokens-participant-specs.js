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
