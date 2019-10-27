const router = require('koa-router')()
const models = require('../models')

router
  .get('/teams', async (ctx) => {
    ctx.body = await models.db.team.findAll({
      order: ['name'],
      include: [{
        model: models.db.participant,
        attributes: ['id', 'fbid']
      }, {
        model: models.db.achievement,
        through: {attributes: []}
      }]
    })
  })
  .get('/teams/stats/:event', async (ctx) => {
    let eventId = ctx.params.event
    await models.db.event.findByPk(eventId).then(async (event) => {
      if (event) {
        await models.db.team.findAll({
          include: {
            model: models.db.participant,
            include: models.db.record
          }
        }).then(async (teams) => {
          if (teams) {
            // Build a map of {participant_id: commitment}
            let commitmentMap = {}
            await models.db.participant_event.findAll({
              where: {event_id: eventId}
            }).map(c => {
              commitmentMap[c.participant_id] = c.commitment
            })
            let results = teams.map(t => {
              let participants = t.participants.map(p => {
                return {
                  // Sum up the participant's records
                  'distance': p.records.filter(r => event.start_date <= r.date && r.date <= event.end_date)
                    .map(r => r.distance).reduce((prev, d) => prev + d, 0),
                  // Find the participant's commitment
                  'commitment': commitmentMap[p.id] ? commitmentMap[p.id] : 0
                }
              })
              // Calculate the total team distance
              let distance = participants.map(p => p.distance).reduce((prev, d) => prev + d, 0)
              // Calculate the total team commitment
              let commitment = participants.map(p => p.commitment).reduce((prev, c) => prev + c, 0)
              return {
                'id': t.id,
                'name': t.name,
                'image': t.image,
                'hidden': t.hidden,
                'distance': distance,
                'commitment': commitment
              }
            })
            ctx.body = results
          } else {
            ctx.status = 204
          }
        })
      } else {
        ctx.status = 204
      }
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
  .post('/teams', async (ctx) => {
    let name = ctx.request.body.name
    let image = ctx.request.body.image
    let creatorId = ctx.request.body.creator_id
    let hidden = ctx.request.body.hidden
    // Verify team name is not used to comply with uniqueness constraint
    let team = await models.db.team.findOne({where: {name}})
    if (team) {
      ctx.status = 409
      ctx.body = {'error': {
        'code': 409,
        'message': `team named "${name}" already exists`
      }}
    } else {
      let creator = await models.db.participant.findOne({where: {fbid: creatorId}})
      if (!creator) {
        ctx.status = 400
        ctx.body = {'error': {
          'code': 400,
          'message': `participant with fbid "${creatorId}" does not exist`
        }}
      } else {
        await models.db.team
          .findOrCreate({where: {name, image, creator_id: creatorId, hidden}})
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
