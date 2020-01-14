const router = require('koa-router')()
const models = require('../models')

router
  .get('/notifications/event/:eventId', async (ctx) => {
    let eventId = ctx.params.eventId
    ctx.body = await models.db.notification.findAll({
      where: {
        event_id: eventId
      },
      order: [['priority', 'ASC'], ['message_date', 'DESC']],
      include: [{
        model: models.db.participant,
        through: {attributes: []}
      }]
    })
  })

module.exports = router
