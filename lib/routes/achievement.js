const router = require('koa-router')()
const models = require('../models')

router
  .get('/achievement', async (ctx) => {
    ctx.body = await models.db.achievement.findAll({
      order: ['distance'],
      include: [{
        model: models.db.team,
        through: {attributes: []}
      }]
    })
  })
  .get('/achievement/:id', async (ctx) => {
    ctx.body = await models.db.achievement.findById(
      ctx.params.id, {
        include: [{
          model: models.db.team,
          through: {attributes: []}
        }]
      })
  })
  .post('/achievement', async (ctx) => {
    let name = ctx.request.body.name
    let distance = ctx.request.body.distance
    await models.db.achievement
      .findOrCreate({where: {name, distance}})
      .spread(function (achievement, created) {
        if (created) {
          ctx.status = 201
          ctx.body = achievement
        } else {
          ctx.status = 409
          ctx.body = {'error': {
            'code': 409,
            'message': `achievement named "${name}" already exists`
          }}
        }
      })
  })
  .patch('/achievement/:id', async (ctx) => {
    await models.db.achievement.update(
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
  .del('/achievement/:id', async (ctx) => {
    await models.db.achievement.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
