const router = require('koa-router')()
const models = require('../models')

router
  .get('/records/:id', async (ctx) => {
    ctx.body = await models.db.record.findById(
      ctx.params.id, {
        include: [models.db.source]
      })
  })
  .post('/records', async (ctx) => {
    let date = ctx.request.body.date
    let distance = ctx.request.body.distance
    let participantId = ctx.request.body.participant_id
    let sourceId = ctx.request.body.source_id
    await models.db.record
      .findOrCreate({where: {
        date: date,
        distance: distance,
        participant_id: participantId,
        source_id: sourceId
      }})
      .spread(function (record, created) {
        if (created) {
          ctx.status = 201
          ctx.body = record
        } else {
          ctx.status = 409
          ctx.body = {'error': {
            'code': 409,
            'message': `specified record already exists`
          }}
        }
      })
  })
  .del('/records/:id', async (ctx) => {
    await models.db.record.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
