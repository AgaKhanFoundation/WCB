const router = require('koa-router')()
const models = require('../models')

router
  .get('/notifications/participant/:fbid', async (ctx) => {
    let fbid = ctx.params.fbid
    await models.db.participant.findOne({
      where: {fbid}
    }).then(async (participant) => {
      if (participant) {
        console.log('participant found for fbid=' + fbid)
        ctx.body = await models.db.participant_notification.findAll({
          where: {participant_id: participant.id}
        })
      } else {
        console.log('participant not found for fbid=' + fbid)
        ctx.status = 204
        ctx.body = {'error': {
          'code': 204,
          'message': `participant with fbid ${fbid} does not exist`
        }}
      }
    })
  })
  .get('/notifications/participant/:fbid/event/:eventId', async (ctx) => {
    let fbid = ctx.params.fbid
    let eventId = ctx.params.eventId
    await models.db.participant.findOne({
      where: {fbid}
    }).then(async (participant) => {
      if (participant) {
        console.log('participant found for fbid=' + fbid)
        ctx.body = await models.db.participant_notification.findAll({
          where:
              {participant_id: participant.id}
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

//   where: {
//     [models.db.sequelize.Op.or]:
//     [ {expiry_date: 0},
//       {expiry_date: null},
//       {expiry_date: {$gte: yesterday}}
//     ],
//     [models.db.sequelize.Op.or]: [{event_id: eventId}, {event_id: 0}]
//   },
//   order: [['priority', 'DESC'], ['message_date', 'DESC']],
//   include: [{
//     model: models.db.participant,
//     attributes: ['fbid'],
//     through: {attributes: ['read_flag']}
//   }
// ]

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
      console.log('participant not found for fbid=' + fbid)
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
