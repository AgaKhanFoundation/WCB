const router = require('koa-router')()
const models = require('../models')

router
  .get('/causes', async (ctx) => {
    ctx.body = await models.db.cause.findAll({order: ['name', 'ASC']})
  })
  .get('/causes/:id', async (ctx) => {
    ctx.body = await models.db.cause.findById(ctx.params.id)
  })
  .post('/causes', async (ctx) => {
    let name = ctx.request.body.name
    await models.db.cause
      .findOrCreate({where: {name}})
      .spread(function (cause, created) {
        if (created) {
          ctx.status = 201
          ctx.body = cause
        } else {
          ctx.status = 409
          ctx.body = {'error': {
            'code': 409,
            'message': `cause named "${name}" already exists`
          }}
        }
      })
  })
  .patch('/causes/:id', async (ctx) => {
    await models.db.cause.update(
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
  .del('/causes/:id', async (ctx) => {
    await models.db.cause.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
