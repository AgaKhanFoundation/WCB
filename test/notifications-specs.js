/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('notifications', () => {
  context('GET /notifications/:id', () => {
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
    let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())
    it('should return 204 if no notification with id=id', async () => {
      await koaRequest
        .get('/notifications/1')
        .expect(204)
    })
    it('should return notification with id=id', async () => {
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: yesterday,
        expiry_date: nextWeek,
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

  context('POST /notifications', () => {
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
    let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())
    it('should create notification with message="notification 1"', async () => {
      let message = 'notification 1'
      let priority = 10
      let eventId = 1
      await koaRequest
        .post('/notifications')
        .send({
          message: message,
          message_date: yesterday,
          expiry_date: nextWeek,
          priority: priority,
          event_id: eventId
        })
        .expect(201)
        .then(response => {
          response.body.message.should.equal(message)
          response.body.message_date.should.be.sameMoment(yesterday)
          response.body.expiry_date.should.be.sameMoment(nextWeek)
          response.body.priority.should.equal(priority)
          response.body.event_id.should.be.equal(eventId)
        })
    })
    it('should return 409 if notification message conflict', async () => {
      let message = 'notification 1'
      let priority = 10
      let eventId = 1
      let n1 = await models.db.notification.create({
        message: message,
        message_date: yesterday,
        expiry_date: nextWeek,
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
          'message': 'this notification message for message_date already exists'
        }})
    })
  })

  context('PATCH /notifications/:id', () => {
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
    let tomorrow = (d => new Date(d.setDate(d.getDate() + 1)))(new Date())
    let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())

    it('should change notification message, message_date, expiry_date, priority, event_id', async () => {
      let message = 'notification 1'
      let priority = 10
      let eventId = 1
      let n1 = await models.db.notification.create({
        message: message,
        message_date: yesterday,
        expiry_date: tomorrow,
        priority: priority,
        event_id: eventId
      })
      await koaRequest
        .patch('/notifications/' + n1.id)
        .send({
          message: 'message 2',
          message_date: yesterday,
          expiry_date: tomorrow,
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
        message: 'notification 10',
        message_date: yesterday,
        expiry_date: tomorrow,
        priority: 10,
        event_id: 1
      })
      let n3 = await models.db.notification.create({
        message: 'notification 20',
        message_date: yesterday,
        expiry_date: nextWeek,
        priority: 10,
        event_id: 1
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

  context('DELETE /notifications/:id', () => {
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())

    it('should delete notification with id=id', async () => {
      let message = 'notification 1'
      let eventId = 1
      let n1 = await models.db.notification.create({
        message,
        message_date: yesterday,
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
