const router = require('koa-router')()
const models = require('../models')

router.get('/', async (ctx) => {
  await models.dbHealthCheck()
  ctx.body = 'ok'
})

module.exports = router
