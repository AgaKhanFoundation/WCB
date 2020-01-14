const router = require('koa-router')()
const models = require('../models')

router
  .get('/notifications', async (ctx) => {
    ctx.body = await models.db.notification.findAll({
      order: [['priority', 'ASC'], ['message_date', 'DESC']],
      include: [{
        model: models.db.participant,
        through: {attributes: []}
      }]
    })
  })
  .get('/notifications/:id', async (ctx) => {
    ctx.body = await models.db.notification.findById(
      ctx.params.id, {
        include: [{
          model: models.db.participant,
          through: {attributes: []}
        }]
      })
  })
  .post('/notifications', async (ctx) => {
    let message = ctx.request.body.message
    let messageDate = ctx.request.body.message_date
    let expiryDate = ctx.request.body.expiry_date
    let priority = ctx.request.body.priority
    let eventId = ctx.request.body.event_id

    if (!messageDate) {
      messageDate = Date.now()
    }
    if (!eventId) {
      eventId = 0
    }

    // Verify message with same date and eventId are not used to comply with uniqueness constraints
    let notification = await models.db.notification.findOne({where: {[models.db.sequelize.Op.and]: [{message}, {message_date: messageDate}, {event_id: eventId}]}})
    if (notification) {
      ctx.status = 409
      ctx.body = {'error': {
        'code': 409,
        'message': 'this notification message for message_date and event_id already exists'
      }}
    } else {
      await models.db.notification
        .findOrCreate({where: {
          message: message,
          message_date: messageDate,
          expiry_date: expiryDate,
          priority: priority,
          event_id: eventId
        }})
        .spread(function (event, created) {
          if (created) {
            ctx.status = 201
            ctx.body = event
          } else {
            ctx.status = 409
            ctx.body = {'error': {
              'code': 409,
              'message': 'this notification message for message_date and event_id already exists'
            }}
          }
        })
    }
  })

  .patch('/notifications/:id', async (ctx) => {
    let notificationId = ctx.params.id
    let message = ctx.request.body.message
    let messageDate = ctx.request.body.message_date
    let eventId = ctx.request.body.event_id

    if (!message && !messageDate && !eventId) {
      let notification = await models.db.notification.findOne({where: {[models.db.sequelize.Op.and]: [{message: message}, {message_date: messageDate}, {event_id: eventId}]}})

      if (notification && notification.id !== notificationId) {
        ctx.status = 400
        ctx.body = {'error': {
          'code': 400,
          'message': 'Validation Error'
        }}
      }
    } else {
      await models.db.notification.update(
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
    }
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

// .get('/notifications/participant/:fbid', async (ctx) => {
//   let fbid = ctx.params.fbid
//   await models.db.participant.findOne({
//     where: {fbid}
//   }).then(async (participant) => {
//     if (participant) {
//       ctx.body = await models.db.participant_notification.findAll({
//         where: {participant_id: participant.id}
//       })
//     } else {
//       ctx.status = 204
//       ctx.body = {'error': {
//         'code': 204,
//         'message': `participant with fbid "${fbid}" does not exist`
//       }}
//     }
//   })
// })
//
// .get('/notifications/notification/:notificationId', async (ctx) => {
//   ctx.body = await models.db.participant_notification.findAll({
//     where: {
//       notification_id: ctx.params.notificationId
//     }
//   })
// })

// .get('/notifications/event/:eventId', async (ctx) => {
//   let eventId = ctx.params.eventId
//   ctx.body = await models.db.notification.findAll({
//     where: {
//       event_id: eventId
//     },
//     order: [['priority', 'ASC'], ['message_date', 'DESC']],
//     include: [{
//       model: models.db.participant,
//       through: {attributes: []}
//     }]
//   })
// })

module.exports = router
