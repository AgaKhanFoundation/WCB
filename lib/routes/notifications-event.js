const router = require('koa-router')()
const models = require('../models')

router
  .get('/notifications/event/:eventId', async (ctx) => {
    let eventId = ctx.params.eventId
    ctx.body = await models.db.notification.findAll({
      where: {
        [models.db.sequelize.Op.or]: [{event_id: eventId}, {event_id: 0}]
      },
      order: [['priority', 'DESC'], ['message_date', 'DESC']],
      include: [{
        model: models.db.participant,
        attributes: ['id', 'fbid']
      }
      ]
    })
  })

module.exports = router
