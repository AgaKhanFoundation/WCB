const Koa = require('koa')
const routes = require('./routes/routes')
const bodyParser = require('koa-bodyparser')

// End points
const teams = require('./routes/teams')
const sponsor = require('./routes/sponsor')
const participant = require('./routes/participant')

const app = new Koa()
app
  .use(bodyParser())
  .use(routes.routes())
  .use(routes.allowedMethods())
  .use(teams.routes())
  .use(teams.allowedMethods())
  .use(sponsor.routes())
  .use(sponsor.allowedMethods())
  .use(participant.routes())
  .use(participant.allowedMethods())

module.exports = app
