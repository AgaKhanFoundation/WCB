/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

// 'message', 'message_date', 'expiry_date', 'priority', 'event_id', 'read_flag'
describe('notifications', () => {
  context('GET /notifications', () => {
    it('should return notifications', async () => {
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: '2019-12-01T00:00:00Z',
        expiry_date: '2019-12-31T00:00:00Z',
        priority: 10,
        event_id: 1
      })
      let n2 = await models.db.notification.create({
        message: 'notification 2',
        message_date: '2019-12-01T00:00:00Z',
        expiry_date: '2019-12-31T00:00:00Z',
        priority: 10,
        event_id: 1
      })
      await koaRequest
        .get('/notifications')
        .expect(200)
        .then(response => {
          response.body[0].message.should.equal(n1.message)
          response.body[0].message_date.should.be.sameMoment(n1.message_date)
          response.body[0].expiry_date.should.be.sameMoment(n1.expiry_date)
          response.body[0].priority.should.equal(n1.priority)
          response.body[0].event_id.should.be.equal(n1.event_id)

          response.body[1].message.should.equal(n2.message)
          response.body[1].message_date.should.be.sameMoment(n2.message_date)
          response.body[1].expiry_date.should.be.sameMoment(n2.expiry_date)
          response.body[1].priority.should.equal(n2.priority)
          response.body[1].event_id.should.be.equal(n2.event_id)
        })
    })
  })

  context('GET /notifications/:id', () => {
    it('should return 204 if no notification with id=id', async () => {
      await koaRequest
        .get('/notifications/1')
        .expect(204)
    })
    it('should return notification with id=id', async () => {
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: '2019-12-01T00:00:00Z',
        expiry_date: '2019-12-31T00:00:00Z',
        priority: 10,
        event_id: 1
      })
      await koaRequest
        .get('/notifications/' + n1.id)
        .expect(200)
        .then(response => {
          response.body.message.should.equal(n1.message)
          response.body.message_date.should.be.sameMoment(n1.message_date)
          response.body.expiry_date.should.be.sameMoment(n1.expiry_date)
          response.body.priority.should.equal(n1.priority)
          response.body.event_id.should.be.equal(n1.event_id)
        })
    })
  })

// REVISE this to check dup using message and messageDate only. Also check eventId if it was provided
  context('POST /notifications', () => {
    it('should create notification with message="notification 1"', async () => {
      let message = 'notification 1'
      let messageDate = '2019-12-01T00:00:00Z'
      let expiryDate = '2019-12-31T00:00:00Z'
      let priority = 10
      let eventId = 1
      await koaRequest
        .post('/notifications')
        .send({
          message: message,
          message_date: messageDate,
          expiry_date: expiryDate,
          priority: priority,
          event_id: eventId
        })
        .expect(201)
        .then(response => {
          response.body.message.should.equal(message)
          response.body.message_date.should.be.sameMoment(messageDate)
          response.body.expiry_date.should.be.sameMoment(expiryDate)
          response.body.priority.should.equal(priority)
          response.body.event_id.should.be.equal(eventId)
        })
    })
    it('should return 409 if notification message conflict', async () => {
      let message = 'notification 1'
      let messageDate = '2019-12-01T00:00:00Z'
      let expiryDate = '2019-12-31T00:00:00Z'
      let priority = 10
      let eventId = 1
      let n1 = await models.db.notification.create({
         message: message,
         message_date: messageDate,
         expiry_date:  expiryDate,
         priority: priority,
         event_id: eventId
      })
      await koaRequest
        .post('/notifications')
        .send({
          message: n1.message,
          message_date: n1.message_date,
          expiry_date: n1.expiry_date,
          priority: n1.priority,
          event_id: n1.event_id
        })
        .expect(409, {'error': {
          'code': 409,
          'message': "this notification message for message_date and event_id already exists"
        }})
    })
  })

  // REVISE this to check dup using message and messageDate only. Also check eventId if it was provided
  context('PATCH /notifications/:id', () => {
    it('should change notification message, message_date, expiry_date, priority, event_id', async () => {
      let message = 'notification 1'
      let messageDate = '2019-12-01T00:00:00Z'
      let expiryDate = '2019-12-31T00:00:00Z'
      let priority = 10
      let eventId = 1
      let n1 = await models.db.notification.create({
        message: message ,
        message_date: messageDate,
        expiry_date: expiryDate,
        priority: priority,
        event_id: eventId
      })
      await koaRequest
        .patch('/notifications/' + n1.id)
        .send({
          message: 'message 2',
          message_date: messageDate,
          expiry_date: expiryDate,
          priority: priority,
          event_id: eventId
        })
        .expect(200, [1])
    })
    it('should return 400 if no notification with id=id', async () => {
      let message = 'notification 1'
      await koaRequest
        .patch('/notifications/' + 2)
        .send({message: message})
        .expect(400, [0])
    })

    it('should return 400 if notification message conflict', async () => {
      let n2 = await models.db.notification.create({
        message: 'notification 1',
        message_date: '2019-12-01T00:00:00Z',
        expiry_date: '2019-12-31T00:00:00Z',
        priority: 10,
        event_id: 1
      })
      let n3 = await models.db.notification.create({
        message: 'notification 2',
        message_date: '2019-12-31T00:00:00Z',
        expiry_date: '2019-12-31T00:00:00Z',
        priority: 10,
        event_id: 2
      })

      await koaRequest
        .patch('/notifications/' + n2.id)
        .send({message: n3.message,
          message_date: n3.message_date,
          event_id: n3.event_id
         })
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

//verify that
  context('DELETE /notifications/:id', () => {
    it('should delete notification with id=id', async () => {
      let message = 'notification 1'
      let messageDate = '2019-12-01T00:00:00Z'
      let eventId = 1
      let n1 = await models.db.notification.create({
        message,
        message_date: messageDate,
        event_id: eventId
      })
      await koaRequest
        .del('/notifications/' + n1.id)
        .expect(204)
    })
    it('should return 400 if no notification with id=id', async () => {
      await koaRequest
        .del('/notifications/' + 0)
        .expect(400)
    })
  })
})

describe('notifications-event', () => {
  context('GET /notifications/event/:id', () => {
    it('should return empty if no notifications for event with id=event', async () => {
      await koaRequest
        .get('/notifications/event/1')
        .expect(200)
        .then(response => {
          response.body.should.deep.equal([])
        })
    })

    it('should return notifications for event with id=eventid', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: '2019-12-01T00:00:00Z',
        expiry_date: '2019-12-31T00:00:00Z',
        priority: 10,
        event_id: 1
      })

      await models.db.participant_notification.create({
        participant_id: p1.id,
        notification_id: n1.id,
        read: false
      })

      await koaRequest
        .get('/notifications/event/' + n1.event_id)
        .expect(200)
        .then(response => {
          response.body[0].event_id.should.equal(n1.event_id)
          response.body[0].notification_id.should.equal(n1.id)
        })
    })
  })
})
