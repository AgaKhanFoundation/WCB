const router = require('koa-router')()
const models = require('../models')

router
  .get('/admin/fcmtokens/', async (ctx) => {
    let tokenList = await models.db.fcmtoken.findAll()
    ctx.body = tokenList
  })

module.exports = router
