const router = require('koa-router')()
const models = require('../models')
/* Sponsor */
router
  .get('/sponsor', async (ctx) => {
    ctx.body = await models.db.sponsor.findAll({order: ['name', 'ASC']})
  })
  .get('/sponsor/:id', async (ctx) => {
    ctx.body = await models.db.sponsor.findById(ctx.params.id)
  })
  .post('/sponsor', async (ctx) => {
    let name = ctx.request.body.name
    let luminateId = ctx.request.body.luminate_id
    await models.db.sponsor.create({
      name: name,
      luminate_id: luminateId
    }).then(result => {
      ctx.status = result ? 201 : 400
      ctx.body = result
    }).catch(err => {
      ctx.status = 400
      ctx.body = err.message
    })
  })
  .del('/sponsor/:id', async (ctx) => {
    await models.db.sponsor.destroy({
      where: {id: ctx.params.id}
    }).then(result => {
      ctx.status = result ? 204 : 400
      ctx.body = result
    }).catch(err => {
      ctx.status = 400
      ctx.body = err.message
    })
  })

module.exports = router
