/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

// 'message', 'message_date', 'expiry_date', 'priority', 'event_id', 'read_flag'
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
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: '2019-12-01T00:00:00Z',
        expiry_date: '2019-12-31T00:00:00Z',
        priority: 10,
        event_id: 1
      })
      // let n2 = await models.db.notification.create({
      //   message: 'notification 2',
      //   message_date: '2019-12-01T00:00:00Z',
      //   expiry_date: '2019-12-31T00:00:00Z',
      //   priority: 10,
      //   event_id: 1
      // })

      await models.db.participant_notification.create({
        participant_id: p1.id,
        notification_id: n1.id,
        read: false
      })
      await koaRequest
        .get('/notifications/participant/' + p1.fbid)
        .expect(200)
        .then(response => {
          response.body[0].participant_id.should.equal(p1.id)
          response.body[0].notification_id.should.equal(n1.id)
        })
    })
  })
})
