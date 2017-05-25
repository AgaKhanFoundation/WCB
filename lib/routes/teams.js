const router = require('koa-router')()
const models = require('../models')

router
  .get('/teams', async (ctx) => {
    ctx.body = await models.db.team.findAll({
      order: 'team.name ASC',
      include: [{
        model: models.db.participant,
        attributes: ['id', 'fbid']
      }, {
        model: models.db.achievement,
        through: {attributes: []}
      }]
    })
  })
  .get('/teams/:id', async (ctx) => {
    ctx.body = await models.db.team.findById(
      ctx.params.id, {
        include: [{
          model: models.db.participant,
          attributes: ['id', 'fbid']
        }, {
          model: models.db.achievement,
          through: {attributes: []}
        }]
      })
  })
  .get('/teams/:id/stats', async (ctx) => {
    let team = await models.db.team.findById(
      ctx.params.id, {
        include: [{
          model: models.db.participant,
          include: [models.db.record]
        }]
      })
    if (team) {
      let distances = team.participants.map(p => {
        return p.records.map(r => r.distance).reduce((prev, d) => prev + d, 0)
      })
      ctx.body = {
        'distance': distances.reduce((prev, d) => prev + d, 0)
      }
    } else {
      ctx.status = 204
    }
  })
  .post('/teams', async (ctx) => {
    let name = ctx.request.body.name
    let image = ctx.request.body.image
    // Verify team name is not used to comply with uniqueness constraint
    let team = await models.db.team.findOne({where: {name}})
    if (team) {
      ctx.status = 409
      ctx.body = {'error': {
        'code': 409,
        'message': `team named "${name}" already exists`
      }}
    } else {
      await models.db.team
        .findOrCreate({where: {name, image}})
        .spread(function (team, created) {
          if (created) {
            ctx.status = 201
            ctx.body = team
          } else {
            ctx.status = 409
            ctx.body = {'error': {
              'code': 409,
              'message': `team named "${name}" already exists`
            }}
          }
        })
    }
  })
  .patch('/teams/:id', async (ctx) => {
    await models.db.team.update(
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
