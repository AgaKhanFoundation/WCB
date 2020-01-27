const router = require('koa-router')()
const models = require('../models')

router
  .get('/notifications', async (ctx) => {
    var yesterday = new Date() - 1 // Date.now()

    ctx.body = await models.db.notification.findAll({
      where: {
        [models.db.sequelize.Op.or]:
        [ {expiry_date: 0},
          {expiry_date: null},
          {expiry_date: {$gte: yesterday}}
        ]
      },
      include: [
        {
          model: models.db.participant,
          through: {attributes: ['id', 'fbid']}
        }
      ],
      order: [['priority', 'DESC'], ['message_date', 'DESC']]
    })
  })
  .get('/notifications/:id', async (ctx) => {
    ctx.body = await models.db.notification.findById(
      ctx.params.id,
      {
        include: [
          {
            model: models.db.participant,
            through: {attributes: ['id', 'fbid']}
          },
          {
            model: models.db.participant_notification,
            through: {attributes: []}
          }
        ],
        order: [['priority', 'DESC'], ['message_date', 'DESC']]
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
    if (!message && !messageDate) {
      let notification = await models.db.notification.findOne(
        {where: {
          [models.db.sequelize.Op.and]: [
            {message: message},
            {message_date: messageDate}
          ]
        }
        })

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

module.exports = router
