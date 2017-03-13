const Koa = require('koa2')
const router = require('./routes')

const app = new Koa()
app
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app
