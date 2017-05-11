const router = require('koa-router')()
const models = require('../models')

router
  .get('/sources', async (ctx) => {
    ctx.body = await models.db.sources.findAll({order: 'name ASC'})
  })
  .get('/sources/:id', async (ctx) => {
    ctx.body = await models.db.sources.findById(ctx.params.id)
  })
  .post('/sources', async (ctx) => {
    let name = ctx.request.body.name
    await models.db.sources
      .findOrCreate({where: {name}})
      .spread(function (source, created) {
        if (created) {
          ctx.status = 201
          ctx.body = source
        } else {
          ctx.status = 409
          ctx.body = {'error': {
            'code': 409,
            'message': `source named "${name}" already exists`
          }}
        }
      })
  })
  .patch('/sources/:id', async (ctx) => {
    await models.db.sources.update(
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
  .del('/sources/:id', async (ctx) => {
    await models.db.sources.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
