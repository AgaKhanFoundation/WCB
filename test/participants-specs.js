/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('participants', () => {
  context('GET /participants/:fbid', () => {
    it('should return 204 if no participant with fbid=fbid', async () => {
      await koaRequest
        .get('/participants/1')
        .expect(204)
    })
    it('should return participant with fbid=fbid', async () => {
      let participant = await models.db.participant.create({fbid: 'p1'})
      await koaRequest
        .get('/participants/' + participant.fbid)
        .expect(200)
        .then(response => {
          response.body.fbid.should.equal(participant.fbid)
        })
    })
    it('should return participant with fbid=fbid including team, participants, and achievements', async () => {
      let t1 = await models.db.team.create({name: 't1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      let a1 = await models.db.achievement.create({name: 'a1', distance: 1})
      await models.db.achievements.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .get('/participants/' + p1.fbid)
        .expect(200)
        .then(response => {
          response.body.fbid.should.equal(p1.fbid)
          response.body.team_id.should.equal(t1.id)
          response.body.team.name.should.equal(t1.name)
          response.body.team.participants[0].fbid.should.equal(p1.fbid)
          response.body.team.achievements[0].name.should.equal(a1.name)
          response.body.team.achievements[0].distance.should.equal(a1.distance)
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
      let p2 = await models.db.participant.create({fbid})
      await koaRequest
        .post('/participants')
        .send({fbid})
        .expect(409, {'error': {
          'code': 409,
          'message': `participant with fbid="${p2.fbid}" already exists`
        }})
    })
  })

  context('PATCH /participants/:fbid', () => {
    it('should set team for participant with fbid=fbid', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let t1 = await models.db.team.create({name: 't1'})
      await koaRequest
        .patch('/participants/' + p1.fbid)
        .send({team_id: t1.id})
        .expect(200)
    })
    it('should return 400 if no participant with id=id', async () => {
      await koaRequest
        .patch('/participants/' + 1)
        .send({team_id: 1})
        .expect(400, [0])
    })
    it('should return 400 if team does not exist', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      await koaRequest
        .patch('/participants/' + p1.fbid)
        .send({team_id: 1})
        .expect(400, {'error': {
          'code': 400,
          'message': 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed'
        }})
    })
  })

  context('DELETE /participants/:fbid', () => {
    it('should delete participant with fbid=fbid', async () => {
      let participant = await models.db.participant.create({fbid: 'p1'})
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
