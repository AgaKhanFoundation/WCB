const KoaRouter = require('koa-router')
const models = require('./models')

const router = new KoaRouter()

router.get('/', async (ctx) => {
  await models.dbHeathCheck()
  ctx.body = 'ok'
})

module.exports = router
