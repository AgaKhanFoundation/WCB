/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('notifications-participant', () => {
  context('GET /notifications/participant/:fbid', () => {
    it('should return 204 if no participant found with fbid=fbid', async () => {
      await koaRequest
        .get('/notifications/participant/p0')
        .expect(204)
    })

    it('should return empty if no notifications for participant with fbid=fbid', async () => {
      await models.db.participant.create({fbid: 'p1'})
      await koaRequest
        .get('/notifications/participant/p1')
        .expect(200)
        .then(response => {
          response.body.should.deep.equal([])
        })
    })

    it('should return notifications for participant with fbid', async () => {
      let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
      let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: yesterday,
        expiry_date: nextWeek,
        priority: 10,
        event_id: 1
      })

      await models.db.participant_notification
        .findOrCreate({where: {
          participant_id: p1.id,
          notification_id: n1.id,
          read_flag: false
        }})

      await koaRequest
        .get('/notifications/participant/' + p1.fbid)
        .expect(200)
        .then(response => {
          response.body[0].message.should.equal(n1.message)
          response.body[0].event_id.should.equal(n1.event_id)
          response.body[0].id.should.equal(n1.id)
        })
    })
  })

  context('GET /notifications/participant/:fbid/event/:eventId', () => {
    it('should return 204 if no participant found with fbid=fbid', async () => {
      await koaRequest
        .get('/notifications/participant/p0/event/e0')
        .expect(204)
    })

    it('should return empty if no notifications for participant with fbid=fbid and event_id=eventId', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      await koaRequest
        .get('/notifications/participant/' + p1.fbid + '/event/e0')
        .expect(200)
        .then(response => {
          response.body.should.deep.equal([])
        })
    })
    it('should return notifications for participant with fbid=fbid and event_id=eventId', async () => {
      let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
      let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: yesterday,
        expiry_date: nextWeek,
        priority: 10,
        event_id: 1
      })

      await models.db.participant_notification
        .findOrCreate({where: {
          participant_id: p1.id,
          notification_id: n1.id,
          read_flag: false
        }})

      await koaRequest
        .get('/notifications/participant/' + p1.fbid)
        .expect(200)
        .then(response => {
          response.body[0].message.should.equal(n1.message)
          response.body[0].event_id.should.equal(n1.event_id)
          response.body[0].id.should.equal(n1.id)
        })
    })
  })

  context('GET /notifications/notification/:notificationId', () => {
    it('should return 204 if no participant found with fbid=fbid', async () => {
      await koaRequest
        .get('/notifications/participant/p0')
        .expect(204)
    })

    it('should return empty if no notifications for participant with fbid=fbid', async () => {
      await models.db.participant.create({fbid: 'p1'})
      await koaRequest
        .get('/notifications/participant/p1')
        .expect(200)
        .then(response => {
          response.body.should.deep.equal([])
        })
    })

    it('should return notifications for participant with fbid', async () => {
      let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
      let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: yesterday,
        expiry_date: nextWeek,
        priority: 10,
        event_id: 1
      })

      await models.db.participant_notification
        .findOrCreate({where: {
          participant_id: p1.id,
          notification_id: n1.id,
          read_flag: false
        }})

      await koaRequest
        .get('/notifications/participant/' + p1.fbid)
        .expect(200)
        .then(response => {
          response.body[0].message.should.equal(n1.message)
          response.body[0].event_id.should.equal(n1.event_id)
          response.body[0].id.should.equal(n1.id)
        })
    })
  })
})
