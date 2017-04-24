const router = require('koa-router')()
const models = require('../models')

router.get('/', async (ctx) => {
  await models.dbHealthCheck()
  ctx.body = {'status': 'OK'}
})

module.exports = router
