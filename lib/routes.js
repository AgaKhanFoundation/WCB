const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('/', async (ctx) => {
  ctx.body = 'ok'
})

module.exports = router
