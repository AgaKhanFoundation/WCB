const router = require('koa-router')()
const models = require('../models')

router
  .get('/teams', async (ctx) => {
    ctx.body = await models.db.team.findAll({order: 'name ASC'})
  })
  .get('/teams/:id', async (ctx) => {
    ctx.body = await models.db.team.findById(ctx.params.id)
  })
  .post('/teams', async (ctx) => {
    let name = ctx.request.body.name
    await models.db.team
      .findOrCreate({where: {name}})
      .spread(function (team, created) {
        if (created) {
          ctx.status = 201
          ctx.body = team
        } else {
          ctx.status = 409
          ctx.body = `Team named "${name}" already exists!`
        }
      })
  })
  .patch('/teams/:id', async (ctx) => {
    await models.db.team.update({
      name: ctx.request.body.name
    }, {
      where: {id: ctx.params.id}
    })
      .then(result => {
        let status = result.every((r) => r)
        ctx.status = status ? 200 : 400
        ctx.body = result
      })
      .catch(err => {
        ctx.status = 400
        ctx.body = err.message
      })
  })
  .del('/teams/:id', async (ctx) => {
    // TODO: #15: Add team size constraint
    await models.db.team.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
