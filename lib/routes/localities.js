const router = require('koa-router')()
const models = require('../models')

router
  .get('/localities', async (ctx) => {
    ctx.body = await models.db.locality.findAll({order: ['name', 'ASC']})
  })
  .get('/localities/:id', async (ctx) => {
    ctx.body = await models.db.locality.findById(ctx.params.id)
  })
  .post('/localities', async (ctx) => {
    let name = ctx.request.body.name
    await models.db.locality
      .findOrCreate({where: {name}})
      .spread(function (locality, created) {
        if (created) {
          ctx.status = 201
          ctx.body = locality
        } else {
          ctx.status = 409
          ctx.body = {'error': {
            'code': 409,
            'message': `locality named "${name}" already exists`
          }}
        }
      })
  })
  .patch('/localities/:id', async (ctx) => {
    await models.db.locality.update(
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
  .del('/localities/:id', async (ctx) => {
    await models.db.locality.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
