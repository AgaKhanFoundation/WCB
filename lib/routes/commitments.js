const router = require('koa-router')()
const models = require('../models')

router
  .get('/commitments/participant/:participant', async (ctx) => {
    ctx.body = await models.db.participant_event.findAll({
      where: {
        participant_id: ctx.params.participant
      }
    })
  })
  .get('/commitments/event/:event', async (ctx) => {
    ctx.body = await models.db.participant_event.findAll({
      where: {
        event_id: ctx.params.event
      }
    })
  })
  .post('/commitments', async (ctx) => {
    let participantId = ctx.request.body.participant_id
    let eventId = ctx.request.body.event_id
    let commitment = ctx.request.body.commitment
    await models.db.participant_event
      .findOrCreate({where: {
        participant_id: participantId,
        event_id: eventId
      },
      defaults: {commitment: commitment}
      })
      .spread(function (commitments, created) {
        if (created) {
          ctx.status = 201
          ctx.body = commitments
        } else {
          ctx.status = 409
          ctx.body = {'error': {
            'code': 409,
            'message': `commitments for participant="${participantId}" and event="${eventId}" already exist`
          }}
        }
      })
  })
  .patch('/commitments/:id', async (ctx) => {
    await models.db.participant_event.update(
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
  .del('/commitments/:id', async (ctx) => {
    await models.db.participant_event.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
