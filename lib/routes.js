const router = require('koa-router')()
const models = require('./models')

router.get('/', async (ctx) => {
  await models.dbHealthCheck()
  ctx.body = 'ok'
})

/* Team */

router
  .get('/team', async (ctx) => {
    ctx.body = await models.db.team.findAll({order: 'name ASC'})
  })
  .get('/team/:id', async (ctx) => {
    ctx.body = await models.db.team.findById(ctx.params.id)
  })
  .post('/team', async (ctx) => {
    let name = ctx.request.body.name
    await models.db.team
      .findOrCreate({where: {name: name}})
      .spread(function (team, created) {
        if (!created) {
          ctx.status = 409
          ctx.body = `Team named "${name}" already exists!`
        } else {
          ctx.body = team
        }
      })
  })
  .put('/team/:id', async (ctx) => {
    await models.db.team.update({
      name: ctx.request.body.newname
    }, {
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.body = result
      })
      .catch(err => {
        ctx.status = 409
        ctx.body = err
      })
  })
  .del('/team/:id', async (ctx) => {
    ctx.body = await models.db.team.destroy({where: {id: ctx.params.id}})
  })

module.exports = router
