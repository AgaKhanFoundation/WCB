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
    let sequence = ctx.request.body.sequence
    let name = ctx.request.body.name
    let distance = ctx.request.body.distance
    let description = ctx.request.body.description
    let iconName = ctx.request.body.icon_name
    let mapImage = ctx.request.body.map_image
    let title = ctx.request.body.title
    let subtitle = ctx.request.body.subtitle
    let content = ctx.request.body.content
    let media = ctx.request.body.media

    // Verify name and sequence are not used to comply with uniqueness constraints
    let achievement = await models.db.achievement.findOne({where: {[models.db.sequelize.Op.or]: [{name}, {sequence}]}})
    if (achievement) {
      ctx.status = 409
      ctx.body = {'error': {
        'code': 409,
        'message': `achievement with sequence="${sequence}" or named "${name}" already exists`
      }}
    } else {
      await models.db.achievement
        .findOrCreate({where: {sequence: sequence, name: name, distance: distance, description: description, icon_name: iconName, map_image: mapImage, title: title, subtitle: subtitle, content: content, media: media}})
        .spread(function (achievement, created) {
          if (created) {
            ctx.status = 201
            ctx.body = achievement
          } else {
            ctx.status = 409
            ctx.body = {'error': {
              'code': 409,
              'message': `achievement with sequence="${sequence}" or named "${name}" already exists`
            }}
          }
        })
    }
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
