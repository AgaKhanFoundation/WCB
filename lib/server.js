const Koa = require('koa')
const router = require('./routes/routes')
const bodyParser = require('koa-bodyparser')

// End points
const teamsRouter = require('./routes/teams')

const app = new Koa()
app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(teamsRouter.routes())
  .use(teamsRouter.allowedMethods())

module.exports = app
