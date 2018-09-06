const router = require('koa-router')()
const models = require('../models')

router
  .get('/achievements/team/:team', async (ctx) => {
    ctx.body = await models.db.team_achievement.findAll({
      where: {
        team_id: ctx.params.team
      }
    })
  })
  .get('/achievements/achievement/:achievement', async (ctx) => {
    ctx.body = await models.db.team_achievement.findAll({
      where: {
        achievement_id: ctx.params.achievement
      }
    })
  })
  .post('/achievements', async (ctx) => {
    let teamId = ctx.request.body.team_id
    let achievementId = ctx.request.body.achievement_id
    await models.db.team_achievement
      .findOrCreate({where: {
        team_id: teamId,
        achievement_id: achievementId
      }})
      .spread(function (achievements, created) {
        if (created) {
          ctx.status = 201
          ctx.body = achievements
        } else {
          ctx.status = 409
          ctx.body = {'error': {
            'code': 409,
            'message': `achievements for team="${teamId}" and achievement="${achievementId}" already exist`
          }}
        }
      })
  })
  .patch('/achievements/:id', async (ctx) => {
    await models.db.team_achievement.update(
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
    await models.db.team_achievement.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
