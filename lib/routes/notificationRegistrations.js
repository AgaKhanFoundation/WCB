const router = require('koa-router')()
const models = require('../models')

router
  .get('/notificationRegistrations/:fbid', async (ctx) => {
    let fbid = ctx.params.fbid
    ctx.body = await models.db.notification_registration.findOne({
      where: {fbid}
    })
  })
  .get('/participants/:fbid/fcmToken', async (ctx) => {
    let fbid = ctx.params.fbid
    let notificationRegistration = await models.db.notification_registration.findOne({
      where: {fbid}
    })
    if (notificationRegistration) {
      ctx.body = notificationRegistration
    } else {
      ctx.status = 204
    }
  })
  .post('/notificationRegistrations', async (ctx) => {
    let fbid = ctx.request.body.fbid
    let fcmToken = ctx.request.body.fcmToken
    // Verify fbid is not used to comply with uniqueness constraint
    let notificationRegistration = await models.db.notification_registration.findOne({where: {fbid}})
    if (notificationRegistration) {
      ctx.status = 409
      ctx.body = {'error': {
        'code': 409,
        'message': `notificationRegistration with fbid="${fbid}" already exists`
      }}
    } else {
      await models.db.notification_registration
        .findOrCreate({where: {fbid, fcmToken}})
        .spread(function (notificationRegistration, created) {
          if (created) {
            ctx.status = 201
            ctx.body = notificationRegistration
          } else {
            ctx.status = 409
            ctx.body = {'error': {
              'code': 409,
              'message': `notificationRegistration with fbid="${fbid}" already exists`
            }}
          }
        })
    }
  })
  .patch('/notificationRegistrations/:fbid', async (ctx) => {
    await models.db.notificationRegistration.update(
      ctx.request.body, {
        where: {fbid: ctx.params.fbid}
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
  .del('/notificationRegistrations/:fbid', async (ctx) => {
    let fbid = ctx.params.fbid
    await models.db.notificationRegistration.destroy({
      where: {fbid}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
