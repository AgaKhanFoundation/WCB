const router = require('koa-router')()
const models = require('../models')

router
  .get('/fcmtokens/participant/:fbid', async (ctx) => {
    let fbid = ctx.params.fbid
    await models.db.participant.findOne({
      where: {fbid}
    })
      .then(async (participant) => {
        if (participant) {
          ctx.body = await models.db.fcmtoken.findOne({
            where: {participant_id: participant.id}
          })
        } else {
          ctx.status = 204
          ctx.body = {'error': {
            'code': 204,
            'message': `participant with fbid "${fbid}" does not exist`
          }}
        }
      })
  })
  .get('/fcmtokens/:id', async (ctx) => {
    ctx.body = await models.db.fcmtoken.findById(ctx.params.id)
  })
  .get('/fcmtokens/token/:token', async (ctx) => {
    ctx.body = await models.db.fcmtoken.findOne({where:
      {fcm_token: ctx.params.token}
    })
  })
  .post('/fcmtokens', async (ctx) => {
    let fcmTokenVal = ctx.request.body.fcm_token
    let fbid = ctx.request.body.fbid
    let participantId = ''
    let fcmtoken = await models.db.fcmtoken.findOne({where: {fcm_token: fcmTokenVal}})
    if (fcmtoken) {
      ctx.status = 409
      ctx.body = {'error': {
        'code': 409,
        'message': `fcmtoken with fcm_token "${fcmTokenVal}" already exists`
      }}
    } else if (fbid) {
      await models.db.participant.findOne({
        where: {fbid}
      })
        .then(async (participant) => {
          if (participant) {
            participantId = participant.id
            let fcmtoken = await models.db.fcmtoken.findOne({where: {
              participant_id: participantId
            }})
            if (fcmtoken) {
              ctx.status = 409
              ctx.body = {'error': {
                'code': 409,
                'message': `fcmtoken already exists for fbid "${fbid}"`
              }}
            } else {
              await models.db.fcmtoken
                .findOrCreate({where: {
                  fcm_token: fcmTokenVal,
                  participant_id: participantId
                }})
                .spread(function (fcmtoken, created) {
                  if (created) {
                    ctx.status = 201
                    ctx.body = fcmtoken
                  } else {
                    ctx.status = 409
                    ctx.body = {'error': {
                      'code': 409,
                      'message': `fcmtoken with fcm_token "${fcmTokenVal}" already exists`
                    }}
                  }
                })
            }
          }
        })
    } else {
      await models.db.fcmtoken
        .findOrCreate({where: {
          fcm_token: fcmTokenVal
        }
        })
        .spread(function (fcmtoken, created) {
          if (created) {
            ctx.status = 201
            ctx.body = fcmtoken
          } else {
            ctx.status = 409
            ctx.body = {'error': {
              'code': 409,
              'message': `fcmtoken with fcm_token "${fcmTokenVal}" already exists`
            }}
          }
        })
    }
  })

  .patch('/fcmtokens/:id', async (ctx) => {
    await models.db.fcmtoken.update(
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
  .patch('/fcmtokens/token/:token', async (ctx) => {
    let fcmTokenVal = ctx.params.token
    let fbid = ctx.request.body.fbid
    let participantId = ctx.request.body.particpant_id

    let fcmtoken = await models.db.fcmtoken.findOne({
      where: {fcm_token: fcmTokenVal}
    })
    if (fcmtoken) {
      if (fbid) {
        await models.db.participant.findOne({
          where: {fbid}
        })
          .then(async (participant) => {
            if (participant) {
              participantId = participant.id
            }
          })
      }
      await models.db.fcmtoken.update({
        fcm_token: fcmTokenVal,
        participant_id: participantId
      }, {
        where: {id: fcmtoken.id}})
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
    } else {
      ctx.status = 400
      ctx.body = {'error': {
        'code': 400,
        'message': `fcmtoken "${fcmTokenVal}" does not exist`
      }}
    }
  })

  .patch('/fcmtokens/participant/:fbid', async (ctx) => {
    let fbid = ctx.params.fbid
    await models.db.participant.findOne({
      where: {fbid}
    })
      .then(async (participant) => {
        if (participant) {
          let fcmtoken = await models.db.fcmtoken.findOne({
            where: {participant_id: participant.id}
          })
          if (fcmtoken) {
            let fcmTokenVal = ctx.request.body.fcm_token
            await models.db.fcmtoken.update({fcm_token: fcmTokenVal}, {
              where: {id: fcmtoken.id}})
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
          } else {
            ctx.status = 400
            ctx.body = {'error': {
              'code': 400,
              'message': `fcmtoken for fbid "${fbid}" does not exist`
            }}
          }
        } else {
          ctx.status = 400
          ctx.body = {'error': {
            'code': 400,
            'message': `participant with fbid "${fbid}" does not exist`
          }}
        }
      })
  })

  .del('/fcmtokens/:id', async (ctx) => {
    await models.db.fcmtoken.destroy({
      where: {id: ctx.params.id}
    })
      .then(result => {
        ctx.status = result ? 204 : 400
        ctx.body = result
      })
  })

  .del('/fcmtokens/participant/:fbid', async (ctx) => {
    let fbid = ctx.params.fbid
    await models.db.participant.findOne({
      where: {fbid}
    })
      .then(async (participant) => {
        if (participant) {
          await models.db.fcmtoken.destroy({
            where: {participant_id: participant.id}
          })
            .then(result => {
              ctx.status = result ? 204 : 400
              ctx.body = result
            })
        } else {
          ctx.status = 400
          ctx.body = {'error': {
            'code': 400,
            'message': `participant with fbid "${fbid}" does not exist`
          }}
        }
      })
  })

module.exports = router
