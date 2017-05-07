/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const model = require('./routes-specs').model

beforeEach(function syncDB () {
  return model.db.sequelize.sync({force: true})
})

describe('participants', () => {
  context('GET /participants/:fbid', () => {
    it('should return 204 if no participant with fbid=fbid', async () => {
      await koaRequest
        .get('/participants/1')
        .expect(204)
    })
    it('should return participant with fbid=fbid', async () => {
      let participant = await model.db.participants.create({fbid: 'p1'})
      await koaRequest
        .get('/participants/' + participant.fbid)
        .expect(200)
        .then(response => {
          response.body.fbid.should.equal(participant.fbid)
        })
    })
  })

  context('POST /participants', () => {
    it('should create participant with fbid=fbid', async () => {
      let fbid = 'p1'
      await koaRequest
        .post('/participants')
        .send({fbid})
        .expect(201)
        .then(response => {
          response.body.fbid.should.equal(fbid)
        })
    })
    it('should return 409 if participant fbid conflict', async () => {
      let fbid = 'p2'
      let p2 = await model.db.participants.create({fbid})
      await koaRequest
        .post('/participants')
        .send({fbid})
        .expect(409, {'error': {
          'code': 409,
          'message': `participant with fbid="${p2.fbid}" already exists`
        }})
    })
  })

  context('DELETE /participants/:fbid', () => {
    it('should delete participant with fbid=fbid', async () => {
      let participant = await model.db.participants.create({fbid: 'p1'})
      await koaRequest
        .del('/participants/' + participant.fbid)
        .expect(204)
    })
    it('should return 400 if no participant with fbid=fbid', async () => {
      await koaRequest
        .del('/participants/' + 0)
        .expect(400)
    })
  })
})
