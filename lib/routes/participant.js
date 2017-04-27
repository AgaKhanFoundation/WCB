const router = require('koa-router')()
const models = require('../models')
/* Participant */
router
  .get('/participant/:id', async (ctx) => {
    let fbid = ctx.params.id
    ctx.body = await models.db.participants.findOne({where: {fbid: fbid}})
  })
  .post('/participant', async (ctx) => {
    let fbid = ctx.request.body.fbid
    await models.db.participants
      .findOrCreate({where: {fbid: fbid}})
      .spread(function (id, created) {
        if (created) {
          ctx.status = 201
          ctx.body = fbid
        } else {
          ctx.status = 409
          ctx.body = `Participant with fbid='"${fbid}"' already exists!`
        }
      })
  })

module.exports = router
