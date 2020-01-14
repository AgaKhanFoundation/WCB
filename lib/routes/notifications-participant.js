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
          'message': `participant with fbid "${fbid}" does not exist`
        }}
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
    if (participant) {
      ctx.status = 204
      ctx.body = {'error': {
        'code': 409,
        'message': `participant with fbid="${fbid}" does not exists`
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
              'message': `participantNotification for fbid="${fbid}" and notification="${notificationId}" already exist`
            }}
          }
        })
    }
  })

  .patch('/notifications/participant/:id', async (ctx) => {
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
