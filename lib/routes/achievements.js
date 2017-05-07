const router = require('koa-router')()
const models = require('../models')

router
  .get('/achievements/team/:team', async (ctx) => {
    ctx.body = await models.db.achievements.findAll({
      where: {
        team: ctx.params.team
      }
    })
  })
  .get('/achievements/achievement/:achievement', async (ctx) => {
    ctx.body = await models.db.achievements.findAll({
      where: {
        achievement: ctx.params.achievement
      }
    })
  })
  .post('/achievements', async (ctx) => {
    let team = ctx.request.body.team
    let achievement = ctx.request.body.achievement
    await models.db.achievements
      .findOrCreate({where: {team, achievement}})
      .spread(function (achievements, created) {
        if (created) {
          ctx.status = 201
          ctx.body = achievements
        } else {
          ctx.status = 409
          ctx.body = {'error': {
            'code': 409,
            'message': `achievements for team="${team}" and achievement="${achievement}" already exist`
          }}
        }
      })
  })
  .patch('/achievements/:id', async (ctx) => {
    await models.db.achievements.update(
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
  .del('/achievements/:id', async (ctx) => {
    await models.db.achievements.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
