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
          response.body[0].notification_id.should.equal(n1.id)
        })
    })
  })

  context('GET /notifications/participant/:fbid/event/:eventId', () => {
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
    let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())

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
          response.body[0].notification_id.should.equal(n1.id)
        })
    })
  })

  context('POST /notifications/participant/', () => {
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
    let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())

    it('should return 204 if no participant found with fbid=p0', async () => {
      await koaRequest
        .post('/notifications/participant/')
        .send({
          fbid: 'p0',
          notification_id: 0
        })
        .expect(204)
    })

    it('should return 204 if no notification found with notification_id=n0', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})

      await koaRequest
        .post('/notifications/participant/')
        .send({
          fbid: p1.fbid,
          notification_id: 0
        })
        .expect(204)
    })

    it('should create notification for a participant with fbid=fbid', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: yesterday,
        expiry_date: nextWeek,
        priority: 10,
        event_id: 1
      })

      let readFlag = false
      await koaRequest
        .post('/notifications/participant')
        .send({
          fbid: p1.fbid,
          notification_id: n1.id,
          read_flag: readFlag

        })
        .expect(201)
        .then(response => {
          response.body.participant_id.should.equal(p1.id)
          response.body.notification_id.should.equal(n1.id)
          response.body.read_flag.should.equal(readFlag)
        })
    })

    it('should return 409 if notification already exists for participant fbid', async () => {
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
        .post('/notifications/participant')
        .send({
          fbid: p1.fbid,
          notification_id: n1.id
        })
        .expect(409)
    })
  })

  context('DELETE /notifications/participant/:id', () => {
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
    let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())

    it('should delete participant specific notification with id=id', async () => {
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
        .del('/notifications/participant/' + p1.id)
        .expect(204)
    })

    it('should return 400 if no notification with id=id', async () => {
      await koaRequest
        .del('/notifications/participant' + 0)
        .expect(400)
    })
  })

  context('GET /notifications/notification/:id', () => {
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
    let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())

    it('should return 204 if no notification with participant_notification.id=id', async () => {
      await koaRequest
        .get('/notifications/notification/' + 0)
        .expect(204)
    })

    it('should return participant specific notification with participant_notification.id=id', async () => {
      let p1 = await models.db.participant.create({fbid: 'p21'})
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: yesterday,
        expiry_date: nextWeek,
        priority: 10,
        event_id: 1
      })

      var pn
      await models.db.participant_notification
        .findOrCreate({where: {
          participant_id: p1.id,
          notification_id: n1.id,
          read_flag: false
        }})
        .spread(function (nr, created) {
          if (created) {
            pn = nr
          } else {
            pn = {}
          }
        })

      await koaRequest
        .get('/notifications/notification/' + pn.id)
        .expect(200)
        .then(response => {
          response.body[0].message.should.equal(n1.message)
          response.body[0].event_id.should.equal(n1.event_id)
          response.body[0].notification_id.should.equal(n1.id)
        })
    })
  })

  context('PATCH /notifications/notification/', () => {
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
    let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())

    it('should change read_flag for notification', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let n1 = await models.db.notification.create({
        message: 'notification 1',
        message_date: yesterday,
        expiry_date: nextWeek,
        priority: 10,
        event_id: 1
      })

      var pn
      await models.db.participant_notification
        .findOrCreate({where: {
          participant_id: p1.id,
          notification_id: n1.id,
          read_flag: false
        }})
        .spread(function (nr, created) {
          if (created) {
            pn = nr
          } else {
            pn = {}
          }
        })

      await koaRequest
        .patch('/notifications/notification/' + pn.id)
        .send({read_flag: true})
        .expect(200, [1])
    })

    it('should return 400 if notification_participant with id=id does not exist', async () => {
      await koaRequest
        .patch('/notifications/notification/' + 0)
        .send({read_flag: true})
        .expect(400, [0])
    })
  })

  context('DELETE /notifications/notification/:id', () => {
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
    let nextWeek = (d => new Date(d.setDate(d.getDate() + 7)))(new Date())

    it('should delete participant specific notification with notification_id=id', async () => {
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
        .del('/notifications/notification/' + n1.id)
        .expect(204)
    })

    it('should return 400 if no notification with id=id', async () => {
      await koaRequest
        .del('/notifications/notification/' + 0)
        .expect(400)
    })
  })
})
