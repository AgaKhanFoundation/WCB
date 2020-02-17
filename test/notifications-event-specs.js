/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('notifications-participant', () => {
  context('GET /notifications/event/:eventId', () => {
    it('should return notifications for event with event', async () => {
      let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
      let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: yesterday,
        expiry_date: nextWeek,
        priority: 10,
        event_id: 1
      })
      await koaRequest
        .get('/notifications/event/' + n1.event_id)
        .expect(200)
        .then(response => {
          response.body[0].message.should.equal(n1.message)
          response.body[0].event_id.should.equal(n1.event_id)
          response.body[0].id.should.equal(n1.id)
        })
    })
  })
})
