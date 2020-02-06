const router = require('koa-router')()
const models = require('../models')

router
  .get('/notifications/participant/:fbid', async (ctx) => {
    let fbid = ctx.params.fbid
    await models.db.participant.findOne({
      where: {fbid},
      include: {model: models.db.notification}
    }).then(async (participant) => {
      var notificationsList = []
      if (participant) {
        notificationsList = participant.notifications
          .filter((n) => {
            var yesterday = new Date() - 1 // Date.now()
            return (
              n.expiry_date === 0 ||
              n.expiry_date == null ||
              n.expiry_date > yesterday)
          })
          .map((n) => {
            console.log('map=' + n.message)
            let pn = n.participant_notification
            console.log('read_flag=' + pn.read_flag)
            return {
              'id': pn.id,
              'notification_id': n.id,
              'message_date': n.message_date,
              'expiry_date': n.expiry_date,
              'priority': n.priority,
              'event_id': n.event_id,
              'message': n.message,
              'read_flag': pn.read_flag
            }
          })
        console.log('notifications=' + notificationsList)
        ctx.body = notificationsList
      } else {
        ctx.status = 204
        ctx.body = {'error': {
          'code': 204,
          'message': `participant with fbid ${fbid} does not exist`
        }
        }
      }
    })
  })
  .get('/notifications/participant/:fbid/event/:eventId', async (ctx) => {
    let fbid = ctx.params.fbid
    let eventId = ctx.params.eventId
    console.log('fbid=$fbid}')
    await models.db.participant.findOne({
      where: {fbid},
      include: {model: models.db.notification}
    }).then(async (participant) => {
      let notificationsList = []
      if (participant) {
        notificationsList = participant.notifications
          .filter((n) => {
            var yesterday = new Date() - 1 // Date.now()
            return (
              (n.expiry_date === 0 ||
              n.expiry_date == null ||
              n.expiry_date > yesterday) &&
              (n.event_id === eventId ||
              n.event_id === 0))
          })
          .map((n) => {
            console.log('notification=' + n.message)
            let pn = n.participant_notification
            console.log('read_flag=' + pn.read_flag)
            return {
              'id': pn.id,
              'notification_id': n.id,
              'message_date': n.message_date,
              'expiry_date': n.expiry_date,
              'priority': n.priority,
              'event_id': n.event_id,
              'message': n.message,
              'read_flag': pn.read_flag
            }
          })
        console.log('notifications =' + notificationsList)
        ctx.body = notificationsList
      } else {
        ctx.status = 204
        ctx.body = {'error': {
          'code': 204,
          'message': `participant with fbid ${fbid} does not exist`
        }
        }
      }
    })
  })
  .get('/notifications/notification/:notificationId', async (ctx) => {
    ctx.body = await models.db.participant_notification.findAll({
      where: {
        notification_id: ctx.params.notificationId
      }
    })
  })

  .post('/notifications/participant', async (ctx) => {
    let fbid = ctx.request.body.fbid
    let notificationId = ctx.request.body.notification_id
    let participant = await models.db.participant.findOne({
      where: {fbid}
    })
    if (!participant) {
      ctx.status = 204
      ctx.body = {'error': {
        'code': 409,
        'message': `participant with fbid=${fbid} does not exists`
      }}
    } else {
      await models.db.participant_notification
        .findOrCreate({where: {
          participant_id: participant.id,
          notification_id: notificationId
        }})
        .spread(function (participantNotification, created) {
          if (created) {
            ctx.status = 201
            ctx.body = participantNotification
          } else {
            ctx.status = 409
            ctx.body = {'error': {
              'code': 409,
              'message': `Notification=${notificationId} already exist for particpant fbid=${fbid}`
            }}
          }
        })
    }
  })

  .patch('/notifications/notification/:id', async (ctx) => {
    await models.db.participant_notification.update(
      ctx.request.body, {
        where: {id: ctx.params.id}
      })
      .then(result => {
        let status = result.every((r) => r)
        ctx.status = status ? 200 : 400
        ctx.body = result
      })
      .catch(err => {
        ctx.status = 400
        ctx.body = {'error': {
          'code': 400,
          'message': err.message
        }}
      })
  })

  .del('/notifications/:id', async (ctx) => {
    await models.db.notification.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

  .del('/notifications/notification/:id', async (ctx) => {
    let notificationId = ctx.params.id

    await models.db.participant_notification.destroy({
      where: {notification_id: notificationId}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

  .del('/notifications/participant/:fbid', async (ctx) => {
    let fbid = ctx.params.fbid
    await models.db.participant.findOne({
      where: {fbid}
    }).then(async (participant) => {
      if (participant) {
        await models.db.participant_notification.destroy({
          where: {participant_id: participant.id}
        })
          .then(result => {
            ctx.status = result ? 204 : 400
            ctx.body = result
          })
      } else {
        ctx.status = 204
        ctx.body = {'error': {
          'code': 204,
          'message': `participant with fbid "${fbid}" does not exist`
        }}
      }
    })
  })

module.exports = router
