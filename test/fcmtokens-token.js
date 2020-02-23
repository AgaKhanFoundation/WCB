/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('fcmtokens', () => {
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

  context('PATCH /fcmtokens/token/:token', () => {
    it('should assign participant_id to fcmtoken fcm_token=token', async () => {
      let token1 = 'token1'
      let f1 = await models.db.fcmtoken.create({fcm_token: token1})
      if (f1) {
        let p1 = await models.db.participant.create({fbid: 'fbid1'})
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
})
