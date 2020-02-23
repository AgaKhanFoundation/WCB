/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('notifications-event', () => {
  context('GET /notifications/event/:id', () => {
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
    let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())
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
        message_date: yesterday,
        expiry_date: nextWeek,
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
          response.body[0].id.should.equal(n1.id)
        })
    })
  })
})
