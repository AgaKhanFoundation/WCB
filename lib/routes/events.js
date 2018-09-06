const router = require('koa-router')()
const models = require('../models')

router
  .get('/events', async (ctx) => {
    ctx.body = await models.db.event.findAll({
      order: ['start_date', 'ASC'],
      include: [
        models.db.cause,
        models.db.locality
      ]
    })
  })
  .get('/events/:id', async (ctx) => {
    ctx.body = await models.db.event.findById(
      ctx.params.id, {
        include: [
          models.db.cause,
          models.db.locality
        ]
      })
  })
  .post('/events', async (ctx) => {
    let name = ctx.request.body.name
    let image = ctx.request.body.image
    let description = ctx.request.body.description
    let startDate = ctx.request.body.start_date
    let endDate = ctx.request.body.end_date
    let teamLimit = ctx.request.body.team_limit
    let teamBuildingStart = ctx.request.body.team_building_start
    let teamBuildingEnd = ctx.request.body.team_building_end
    // Verify event name is not used to comply with uniqueness constraint
    let event = await models.db.event.findOne({where: {name}})
    if (event) {
      ctx.status = 409
      ctx.body = {'error': {
        'code': 409,
        'message': `event named "${name}" already exists`
      }}
    } else {
      await models.db.event
        .findOrCreate({where: {
          name: name,
          image: image,
          description: description,
          start_date: startDate,
          end_date: endDate,
          team_limit: teamLimit,
          team_building_start: teamBuildingStart,
          team_building_end: teamBuildingEnd
        }})
        .spread(function (event, created) {
          if (created) {
            ctx.status = 201
            ctx.body = event
          } else {
            ctx.status = 409
            ctx.body = {'error': {
              'code': 409,
              'message': `event named "${name}" already exists`
            }}
          }
        })
    }
  })
  .patch('/events/:id', async (ctx) => {
    await models.db.event.update(
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
  .del('/events/:id', async (ctx) => {
    await models.db.event.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
