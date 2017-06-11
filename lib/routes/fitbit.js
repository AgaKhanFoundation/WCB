const router = require('koa-router')()
const models = require('../models')
const moment = require('moment')
const Fitbit = require('../dataSources/fitbit/fitbit')
router
  .get('/fitbit', async (ctx) => {
    ctx.body = await models.db.fitbit.findAll({order: 'id ASC'})
  })
  .get('/fitbit/:id', async (ctx) => {
    ctx.body = await models.db.fitbit.findById(ctx.params.id)
  })
  // TODO: Remove updateData when subscription is completed
  // For now this is just an endpoint to trigger fetching data from fitbit api
  .get('/fitbit/:id/updateData', async (ctx) => {
    var f = new Fitbit('5NBCMX')
    var res = await f.fetchData()
    ctx.body = [res]
  })

  .post('/fitbit', async (ctx) => {
    let fitbitId = ctx.request.body.fitbitId
    let accessToken = ctx.request.body.accessToken
    let refreshToken = ctx.request.body.refreshToken
    let expiresIn = ctx.request.body.expiresIn
    let participantId = ctx.request.body.participantId
    let expiresAt = moment().add(expiresIn - 5000, 'ms').format('YYYY-MM-DD HH:mm:ss')

    await models.db.fitbit.create({
      fitbit_id: fitbitId,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      participant_id: participantId
    }).then(result => {
      ctx.status = result ? 201 : 400
      ctx.body = result
    }).catch(err => {
      ctx.status = 409
      ctx.body = {'error': {
        'code': 409,
        'message': `Fitbit user already exisits`
      }}
      console.error('Error while posting fitbit user tokens: ' + err.message)
    })
  })
  .del('/fitbit/:id', async (ctx) => {
    await models.db.fitbit.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

module.exports = router
