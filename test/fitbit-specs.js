/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models
const moment = require('moment')

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

var fitbitUser1 = {
  'fitbitId': '5NBCMY',
  'accessToken': 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1TkJDTVgiLCJhdWQiOiIyMjg5SzUiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyd2VpIHJhY3QgcnBybyIsImV4cCI6MTQ5NDIxNDA0MywiaWF0IjoxNDk0MTg1MjQzfQ.KHCBPMKjrhLG2u5MTMW3TbyDrsrAFJrIS3VmZpLOevY',
  'refreshToken': 'd8a0eb5a20003a9db5668d94f79f4c33db374ec74101ac3f8426a5f02f14af3b'
}
var fitbitUser2 = {
  'fitbitId': '5NBCMZ',
  'accessToken': 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1TkJDTVgiLCJhdWQiOiIyMjg5SzUiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyd2VpIHJhY3QgcnBybyIsImV4cCI6MTQ5NDIxNDA0MywiaWF0IjoxNDk0MTg1MjQzfQ.KHCBPMKjrhLG2u5MTMW3TbyDrsrAFJrIS3VmZpLOevY',
  'refreshToken': 'd8a0eb5a20003a9db5668d94f79f4c33db374ec74101ac3f8426a5f02f14af3b'
}

describe('fitbit', () => {
  context('GET /fitbit/:id', () => {
    it('should return 204 if no fitbit user with id=id', async () => {
      await koaRequest
        .get('/fitbit/1')
        .expect(204)
    })
    it('should return fitbit user with id=id', async () => {
      let time1 = moment().format('YYYY-MM-DD HH:mm:ss')
      let user1 = {
        'fitbit_id': '5NBCMX',
        'access_token': 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1TkJDTVgiLCJhdWQiOiIyMjg5SzUiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyd2VpIHJhY3QgcnBybyIsImV4cCI6MTQ5NDIxNDA0MywiaWF0IjoxNDk0MTg1MjQzfQ.KHCBPMKjrhLG2u5MTMW3TbyDrsrAFJrIS3VmZpLOevY',
        'refresh_token': 'd8a0eb5a20003a9db5668d94f79f4c33db374ec74101ac3f8426a5f02f14af3b'
      }
      let participant1 = await models.db.participant.create({fbid: 'p1'})
      user1.expires_at = time1
      user1.participant_id = participant1.id
      let fitbit = await models.db.fitbit.create(user1)
      await koaRequest
        .get('/fitbit/' + fitbit.id)
        .expect(200)
        .then(response => {
          response.body.fitbit_id.should.equal(user1.fitbit_id)
          response.body.access_token.should.equal(user1.access_token)
          response.body.refresh_token.should.equal(user1.refresh_token)
          response.body.participant_id.should.equal(participant1.id)
        })
    })
  })

  context('POST /fitbit', () => {
    it('should create fitbit user', async () => {
      let time1 = moment().format('YYYY-MM-DD HH:mm:ss')
      let participant1 = await models.db.participant.create({fbid: 'p1'})
      fitbitUser1.expiresAt = time1
      fitbitUser1.participantId = participant1.id
      await koaRequest
        .post('/fitbit')
        .send(fitbitUser1)
        .expect(201)
        .then(response => {
          response.body.fitbit_id.should.equal(fitbitUser1.fitbitId)
          response.body.access_token.should.equal(fitbitUser1.accessToken)
          response.body.refresh_token.should.equal(fitbitUser1.refreshToken)
          response.body.participant_id.should.equal(participant1.id)
        })
    })
    it('should return 409 if user with same fitbit id already exisits', async () => {
      let time1 = moment().format('YYYY-MM-DD HH:mm:ss')
      let participant1 = await models.db.participant.create({fbid: 'p1'})
      let user1 = {
        'fitbit_id': '5NBCMX',
        'access_token': 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1TkJDTVgiLCJhdWQiOiIyMjg5SzUiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyd2VpIHJhY3QgcnBybyIsImV4cCI6MTQ5NDIxNDA0MywiaWF0IjoxNDk0MTg1MjQzfQ.KHCBPMKjrhLG2u5MTMW3TbyDrsrAFJrIS3VmZpLOevY',
        'refresh_token': 'd8a0eb5a20003a9db5668d94f79f4c33db374ec74101ac3f8426a5f02f14af3b'
      }
      user1.expires_at = time1
      user1.participant_id = participant1.id
      await models.db.fitbit.create(user1)

      let participant2 = await models.db.participant.create({fbid: 'p2'})
      let duplicateUser = fitbitUser2
      duplicateUser.expires_at = time1
      duplicateUser.participant_id = participant2.id
      duplicateUser.fitbitId = user1.fitbit_id
      await koaRequest
        .post('/fitbit')
        .send(duplicateUser)
        .expect(409, {'error': {
          'code': 409,
          'message': `Fitbit user already exisits`
        }})
    })
  })

  context('DELETE /fitbit/:fbid', () => {
    it('should delete fitbit', async () => {
      let time1 = moment().format('YYYY-MM-DD HH:mm:ss')
      let participant1 = await models.db.participant.create({fbid: 'p1'})
      let user1 = {
        'fitbit_id': '5NBCMX',
        'access_token': 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1TkJDTVgiLCJhdWQiOiIyMjg5SzUiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyd2VpIHJhY3QgcnBybyIsImV4cCI6MTQ5NDIxNDA0MywiaWF0IjoxNDk0MTg1MjQzfQ.KHCBPMKjrhLG2u5MTMW3TbyDrsrAFJrIS3VmZpLOevY',
        'refresh_token': 'd8a0eb5a20003a9db5668d94f79f4c33db374ec74101ac3f8426a5f02f14af3b'
      }
      user1.expires_at = time1
      user1.participant_id = participant1.id
      var user = await models.db.fitbit.create(user1)
      await koaRequest
        .del('/fitbit/' + user.id)
        .expect(204)
    })
    it('should return 400 if user does not exists', async () => {
      await koaRequest
        .del('/fitbit/' + 0)
        .expect(400)
    })
  })
})
