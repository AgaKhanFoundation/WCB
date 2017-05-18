const router = require('koa-router')()
const models = require('../models')

router
  .get('/events', async (ctx) => {
    ctx.body = await models.db.event.findAll({order: 'id ASC'})
  })
  .get('/events/:id', async (ctx) => {
    ctx.body = await models.db.event.findById(ctx.params.id)
  })
  .post('/events', async (ctx) => {
    let name = ctx.request.body.name
    await models.db.event
      .findOrCreate({where: {name}})
      .spread(function (event, created) {
        if (created) {
          ctx.status = 201
          ctx.body = event
        } else {
          ctx.status = 409
          ctx.body = {'error': {
            'code': 409,
            'message': `event named "${name}" already exists`
          }}
        }
      })
  })
  .patch('/events/:id', async (ctx) => {
    await models.db.event.update(
        ctx.request.body, {
          where: {id: ctx.params.id}
        })
        .then(result => {
          let status = result.every((r) => r)
          ctx.status = status ? 200 : 400
          ctx.body = result
        })
        .catch(err => {
          ctx.status = 400
          ctx.body = {'error': {
            'code': 400,
            'message': err.message
          }}
        })
  })
  .del('/events/:id', async (ctx) => {
    await models.db.event.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router

