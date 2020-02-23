/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('fcmtokens', () => {
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
})
