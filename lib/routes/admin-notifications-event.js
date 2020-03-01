const router = require('koa-router')()
const models = require('../models')

/// API for admin console only. we will add additional security enforcement
// Apps will use participant + event specific notification APIs only
router
  .get('/admin/notifications/event/:eventId', async (ctx) => {
    let eventId = ctx.params.eventId
    await models.db.notification.findAll({
      where: {
        [models.db.sequelize.Op.or]: [{event_id: eventId}, {event_id: 0}]
      },
      order: [['message_date', 'DESC'], ['priority', 'DESC']],
      include: [{
        model: models.db.participant,
        attributes: ['id', 'fbid']
      }
      ]
    })
      .then(async (nlist) => {
        if (!nlist) {
          ctx.status = 204
          return
        }
        ctx.body = nlist
      })
  })

module.exports = router
