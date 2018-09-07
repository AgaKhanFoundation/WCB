const router = require('koa-router')()
const models = require('../models')

router
  .get('/participants/:fbid', async (ctx) => {
    let fbid = ctx.params.fbid
    ctx.body = await models.db.participant.findOne({
      where: {fbid},
      include: [{
        model: models.db.team,
        include: [{
          model: models.db.participant,
          attributes: ['id', 'fbid']
        }, {
          model: models.db.achievement,
          through: {attributes: []}
        }]
      },
      models.db.cause,
      models.db.event,
      models.db.record,
      models.db.source
      ]
    })
  })
  .get('/participants/:fbid/stats', async (ctx) => {
    let fbid = ctx.params.fbid
    let participant = await models.db.participant.findOne({
      where: {fbid},
      include: [models.db.record]
    })
    if (participant) {
      let distances = participant.records.map(r => r.distance)
      ctx.body = {
        'distance': distances.reduce((prev, d) => prev + d, 0)
      }
    } else {
      ctx.status = 204
    }
  })
  .post('/participants', async (ctx) => {
    let fbid = ctx.request.body.fbid
    await models.db.participant
      .findOrCreate({where: {fbid}})
      .spread(function (participant, created) {
        if (created) {
          ctx.status = 201
          ctx.body = participant
        } else {
          ctx.status = 409
          ctx.body = {'error': {
            'code': 409,
            'message': `participant with fbid="${fbid}" already exists`
          }}
        }
      })
  })
  .patch('/participants/:fbid', async (ctx) => {
    await models.db.participant.update(
      ctx.request.body, {
        where: {fbid: ctx.params.fbid}
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
  .del('/participants/:fbid', async (ctx) => {
    let fbid = ctx.params.fbid
    await models.db.participant.destroy({
      where: {fbid}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
