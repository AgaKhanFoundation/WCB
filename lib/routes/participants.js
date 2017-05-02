const router = require('koa-router')()
const models = require('../models')

router
  .get('/participants/:id', async (ctx) => {
    let fbid = ctx.params.id
    ctx.body = await models.db.participants.findOne({where: {fbid}})
  })
  .post('/participants', async (ctx) => {
    let fbid = ctx.request.body.fbid
    await models.db.participants
      .findOrCreate({where: {fbid}})
      .spread(function (participant, created) {
        if (created) {
          ctx.status = 201
          ctx.body = participant
        } else {
          ctx.status = 409
          ctx.body = `Participant with fbid='"${fbid}"' already exists!`
        }
      })
  })

module.exports = router
