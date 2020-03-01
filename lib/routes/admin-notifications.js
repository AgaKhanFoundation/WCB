const router = require('koa-router')()
const models = require('../models')

/// API for admin console only. we will add additional security enforcement
// Apps will use participant + event specific notification APIs only
router
  .get('/admin/notifications', async (ctx) => {
    ctx.body = await models.db.notification.findAll({
      include: [
        {
          model: models.db.participant,
          attributes: ['id', 'fbid']
        }
      ],
      order: [['message_date', 'DESC'], ['priority', 'DESC']]
    })
  })

module.exports = router
