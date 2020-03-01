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
            let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
            return (
              n.expiry_date === 0 ||
              n.expiry_date == null ||
              n.expiry_date > yesterday)
          })
          .map((n) => {
            let pn = n.participant_notification
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
          .sort((a, b) => (a.message_date > b.message_date) ? 1 : ((a.priority > b.priority) ? 1 : 0))

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
    let eventId = parseInt(ctx.params.eventId)
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())

    await models.db.participant.findOne({
      where: {fbid},
      include: {model: models.db.notification}
    }).then(async (participant) => {
      let notificationsList = []
      if (participant) {
        notificationsList = participant.notifications
          .filter((n) => {
            return (
              ((n.expiry_date === 0 ||
              n.expiry_date == null ||
              n.expiry_date > yesterday)) &&
              (n.event_id === eventId ||
              n.event_id === 0))
          })
          .map((n) => {
            let pn = n.participant_notification
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
          .sort((a, b) => (a.message_date > b.message_date) ? -1 : ((a.priority > b.priority) ? -1 : 0))
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

  .post('/notifications/participant', async (ctx) => {
    let fbid = ctx.request.body.fbid
    let notificationId = ctx.request.body.notification_id

    let participant = await models.db.participant.findOne({
      where: {fbid}
    })
    if (!participant) {
      ctx.status = 204
      ctx.body = {'error': {
        'code': 204,
        'message': `participant with fbid=${fbid} does not exists`
      }}
      return
    }

    let notification = await models.db.notification.findById(notificationId)
    if (!notification) {
      ctx.status = 204
      ctx.body = {'error': {
        'code': 204,
        'message': `event with event_id=${notificationId} does not exists`
      }}
      return
    }

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
  })

  .del('/notifications/participant/:fbid', async (ctx) => {
    let fbid = ctx.params.fbid
    let participant = await models.db.participant.findOne({
      where: {fbid}
    })
    if (!participant) {
      ctx.status = 204
      ctx.body = {'error': {
        'code': 204,
        'message': `participant with fbid "${fbid}" does not exist`
      }}
      return
    }

    await models.db.participant_notification.destroy({
      where: {participant_id: participant.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

  .get('/notifications/notification/:id', async (ctx) => {
    let pnid = ctx.params.id
    let pn = await models.db.participant_notification.findByPk(pnid)
    if (!pn) {
      ctx.status = 204
      ctx.body = {'error': {
        'code': 204,
        'message': `participant_notification with id=${pnid} does not exists`
      }}
      return
    }

    let n = await models.db.notification.findById(pn.id)
    if (!n) {
      ctx.status = 204
      ctx.body = {'error': {
        'code': 204,
        'message': `notification with id=${pn.id} does not exists`
      }}
      return
    }

    let n1 = {
      'id': pn.id,
      'notification_id': n.id,
      'message_date': n.message_date,
      'expiry_date': n.expiry_date,
      'priority': n.priority,
      'event_id': n.event_id,
      'message': n.message,
      'read_flag': pn.read_flag
    }
    let nlist = []
    nlist[0] = n1
    ctx.status = 200
    ctx.body = nlist
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

module.exports = router
