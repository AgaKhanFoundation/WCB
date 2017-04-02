const Koa = require('koa')
const routes = require('./routes/routes')
const bodyParser = require('koa-bodyparser')

// End points
const teams = require('./routes/teams')

const app = new Koa()
app
  .use(bodyParser())
  .use(routes.routes())
  .use(routes.allowedMethods())
  .use(teams.routes())
  .use(teams.allowedMethods())

module.exports = app
