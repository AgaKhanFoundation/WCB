/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('notificationRegistrations', () => {
  context('GET /notificationRegistrations/:fbid', () => {
    it('should return 204 if no notificationRegistration with fbid=fbid', async () => {
      await koaRequest
        .get('/notificationRegistrations/1')
        .expect(204)
    })
    it('should return notificationRegistration with fbid=fbid', async () => {
      let notificationRegistration = await models.db.notificationRegistration.create({fbid: 'p1', fcmToken: '12345'})
      await koaRequest
        .get('/notificationRegistrations/' + notificationRegistration.fbid)
        .expect(200)
        .then(response => {
          response.body.fbid.should.equal(notificationRegistration.fbid)
          response.body.fcmToken.should.equal(notificationRegistration.fcmToken)
        })
    })
    })

  context('GET /participants/:fbid/fcmToken', () => {
    it('should return 204 if no participant with fbid=fbid', async () => {
      await koaRequest
        .get('/participants/1/fcmToken')
        .expect(204)
    })
    it('should return fcmToken for participant with fbid=fbid', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let n1 = await models.db.notificationRegistration.create({fbid: 'p1', fcmToken: '12345'})
      await koaRequest
        .get('/participants/' + p1.fbid + '/fcmToken')
        .expect(200)
        .then(response => {
          response.body.fcmToken.should.equal(n1.fcmToken)
        })
    })
  })

  context('POST /notificationRegistrations', () => {
    it('should create notificationRegistration with fbid=fbid and fcmToken=fcmToken', async () => {
      let fbid = 'p1'
      let fcmToken = '12345'
      await koaRequest
        .post('/notificationRegistrations')
        .send({fbid, fcmToken})
        .expect(201)
        .then(response => {
          response.body.fbid.should.equal(fbid)
          response.body.fcmToken.should.equal(fcmToken)
        })
    })
    it('should return 409 if notificationRegistration fbid conflict', async () => {
      let fbid = 'p2'
      let p2 = await models.db.notificationRegistration.create({fbid})
      await koaRequest
        .post('/notificationRegistrations')
        .send({fbid})
        .expect(409, {'error': {
          'code': 409,
          'message': `notificationRegistration with fbid="${p2.fbid}" already exists`
        }})
    })
  })

  context('PATCH /notificationRegistrations/:fbid', () => {
    it('should set fcmToken for notificationRegistration with fbid=fbid', async () => {
      let p1 = await models.db.notificationRegistration.create({fbid: 'p1'})
      let fcmToken = '12345'
      await koaRequest
        .patch('/notificationRegistrations/' + p1.fbid)
        .send({fcmToken: fcmToken})
        .expect(200)
    })
    it('should return 400 if no notificationRegistration with id=id', async () => {
      await koaRequest
        .patch('/notificationRegistrations/' + 1)
        .send({fcmToken: fcmToken})
        .expect(400, [0])
    })
    it('should set fcmToken for participant with fbid=fbid', async () => {
      let p1 = await models.db.notificationRegistration.create({fbid: 'p1'})
      await koaRequest
        .patch('/notificationRegistrations/' + p1.fbid)
        .send({fcmToken: fcmToken})
        .expect(200)
    })
  })

  context('DELETE /notificationRegistrations/:fbid', () => {
    it('should delete notificationRegistration with fbid=fbid', async () => {
      let notificationRegistration = await models.db.notificationRegistration.create({fbid: 'p1'})
      await koaRequest
        .del('/notificationRegistrations/' + notificationRegistration.fbid)
        .expect(204)
    })
    it('should return 400 if no notificationRegistration with fbid=fbid', async () => {
      await koaRequest
        .del('/notificationRegistrations/' + 0)
        .expect(400)
    })
  })
})
