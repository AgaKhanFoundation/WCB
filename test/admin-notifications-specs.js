/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})
describe('admin-notifications', () => {
  context('GET /admin/notifications', () => {
    it('should return notifications', async () => {
      let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
      let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())

      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: yesterday,
        expiry_date: nextWeek,
        priority: 10,
        event_id: 1
      })
      let n2 = await models.db.notification.create({
        message: 'notification 2',
        message_date: yesterday,
        expiry_date: nextWeek,
        priority: 10,
        event_id: 1
      })
      await koaRequest
        .get('/admin/notifications')
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
})
