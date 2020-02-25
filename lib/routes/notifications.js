const router = require('koa-router')()
const models = require('../models')

router
  .get('/notifications/:id', async (ctx) => {
    ctx.body = await models.db.notification.findById(
      ctx.params.id,
      {
        include: [
          {
            model: models.db.participant, attributes: ['id', 'fbid']
          }
        ],
        order: [['message_date', 'DESC'], ['priority', 'DESC']]
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
    let notification = await models.db.notification.findOne(
      {where:
        {[models.db.sequelize.Op.and]:
          [ {message},
            {message_date: messageDate},
            {event_id: eventId}
          ]
        }
      })
    if (notification) {
      ctx.status = 409
      ctx.body = {'error': {
        'code': 409,
        'message': 'this notification message for message_date already exists'
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
              'message': 'this notification message for message_date already exists'
            }}
          }
        })
    }
  })

  .patch('/notifications/:id', async (ctx) => {
    let notificationId = ctx.params.id
    let message = ctx.request.body.message
    let messageDate = ctx.request.body.message_date

    let currentNotification = await models.db.notification.findByPk(notificationId)
    if (!currentNotification) {
      ctx.status = 400
      ctx.body = {'error': {
        'code': 400,
        'message': 'Not found'
      }}
    }

    // ensure that patch won't create duplicates
    var updateable = true
    var notification
    if (message !== '' && messageDate !== '') {
      notification = await models.db.notification.findOne(
        {where: {
          [models.db.sequelize.Op.and]: [
            {message: message},
            {message_date: messageDate}
          ]
        }
        })

      if (notification) {
        if (notification.id !== currentNotification.id) {
          updateable = false
        }
      }
    } else if (message !== '') {
      notification = await models.db.notification.findOne(
        {where: {message: message}})

      if (notification) {
        if (notification.id !== currentNotification.id &&
            notification.message_date === currentNotification.message_date) {
          ctx.status = 400
          ctx.body = {'error': {
            'code': 400,
            'message': 'Validation error'
          }}
        }
      }
    } else if (messageDate !== '') {
      notification = await models.db.notification.findOne(
        {where: {message_date: messageDate}})

      if (notification) {
        if (notification.id !== currentNotification.id &&
            notification.message === currentNotification.message) {
          updateable = false
        }
      }
    }

    if (updateable) {
      await models.db.notification.update(
        ctx.request.body, {
          where: {id: notificationId}
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
    } else {
      ctx.status = 400
      ctx.body = {'error': {
        'code': 400,
        'message': 'Validation error'
      }}
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

module.exports = router
