const Koa = require('koa')
const routes = require('./routes/routes')
const bodyParser = require('koa-bodyparser')

// End points
const teams = require('./routes/teams')
const sponsor = require('./routes/sponsor')
const participants = require('./routes/participants')

const app = new Koa()
app
  .use(bodyParser())
  .use(routes.routes())
  .use(routes.allowedMethods())
  .use(teams.routes())
  .use(teams.allowedMethods())
  .use(sponsor.routes())
  .use(sponsor.allowedMethods())
  .use(participants.routes())
  .use(participants.allowedMethods())

module.exports = app
