/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('teams', () => {
  context('GET /teams', () => {
    it('should return teams', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      let t2 = await models.db.team.create({name: 't2', image: 'i2'})
      await koaRequest
        .get('/teams')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(t1.name)
          response.body[0].image.should.equal(t1.image)
          response.body[1].name.should.equal(t2.name)
          response.body[1].image.should.equal(t2.image)
        })
    })
    it('should return teams with participants', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      await koaRequest
        .get('/teams')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(t1.name)
          response.body[0].image.should.equal(t1.image)
          response.body[0].participants[0].fbid.should.equal(p1.fbid)
        })
    })
    it('should return teams with achievements', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      let a1 = await models.db.achievement.create({name: 'a1', distance: 1})
      await models.db.achievements.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .get('/teams')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(t1.name)
          response.body[0].image.should.equal(t1.image)
          response.body[0].achievements[0].name.should.equal(a1.name)
          response.body[0].achievements[0].distance.should.equal(a1.distance)
        })
    })
  })

  context('GET /teams/:id', () => {
    it('should return 204 if no team with id=id', async () => {
      await koaRequest
        .get('/teams/1')
        .expect(204)
    })
    it('should return team with id=id', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      await koaRequest
        .get('/teams/' + t1.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(t1.name)
          response.body.image.should.equal(t1.image)
        })
    })
    it('should return team with id=id with participants', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      await koaRequest
        .get('/teams/' + t1.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(t1.name)
          response.body.image.should.equal(t1.image)
          response.body.participants[0].fbid.should.equal(p1.fbid)
        })
    })
    it('should return team with id=id with achievements', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      let a1 = await models.db.achievement.create({name: 'a1', distance: 1})
      await models.db.achievements.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .get('/teams/' + t1.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(t1.name)
          response.body.image.should.equal(t1.image)
          response.body.achievements[0].name.should.equal(a1.name)
          response.body.achievements[0].distance.should.equal(a1.distance)
        })
    })
  })

  context('GET /teams/:id/stats', () => {
    it('should return 204 if no team with id=id', async () => {
      await koaRequest
        .get('/teams/1/stats')
        .expect(204)
    })
    it('should return sum of distances for participants in team with id=id', async () => {
      let t1 = await models.db.team.create({name: 't1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      let p2 = await models.db.participant.create({fbid: 'p2', team_id: t1.id})
      let s1 = await models.db.source.create({name: 's1'})
      let r1 = await models.db.record.create({
        date: '2017-01-01T00:00:00Z',
        distance: 6,
        participant_id: p1.id,
        source_id: s1.id
      })
      let r2 = await models.db.record.create({
        date: '2017-01-02T00:00:00Z',
        distance: 12,
        participant_id: p2.id,
        source_id: s1.id
      })
      await koaRequest
        .get('/teams/' + t1.id + '/stats')
        .expect(200)
        .then(response => {
          response.body.distance.should.equal(r1.distance + r2.distance)
        })
    })
  })

  context('POST /teams', () => {
    it('should create team with name=name', async () => {
      let name = 't1'
      await koaRequest
        .post('/teams')
        .send({name})
        .expect(201)
        .then(response => {
          response.body.name.should.equal(name)
        })
    })
    it('should create team with name=name and image=image', async () => {
      let name = 't1'
      let image = 'i1'
      await koaRequest
        .post('/teams')
        .send({name, image})
        .expect(201)
        .then(response => {
          response.body.name.should.equal(name)
          response.body.image.should.equal(image)
        })
    })
    it('should return 409 if team name conflict', async () => {
      let t2 = await models.db.team.create({name: 't2'})
      await koaRequest
        .post('/teams')
        .send({name: t2.name})
        .expect(409, {'error': {
          'code': 409,
          'message': `team named "${t2.name}" already exists`
        }})
    })
  })

  context('PATCH /teams/:id', () => {
    it('should change team name', async () => {
      let t1 = await models.db.team.create({name: 't1'})
      await koaRequest
        .patch('/teams/' + t1.id)
        .send({name: 't2'})
        .expect(200, [1])
    })
    it('should return 400 if no team with id=id', async () => {
      await koaRequest
        .patch('/teams/' + 1)
        .send({name: 't2'})
        .expect(400, [0])
    })
    it('should return 400 if team name conflict', async () => {
      let t2 = await models.db.team.create({name: 't2'})
      let t3 = await models.db.team.create({name: 't3'})
      await koaRequest
        .patch('/teams/' + t2.id)
        .send({name: t3.name})
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

  context('DELETE /teams/:id', () => {
    it('should delete team with id=id', async () => {
      let t1 = await models.db.team.create({name: 't1'})
      await koaRequest
        .del('/teams/' + t1.id)
        .expect(204)
    })
    it('should return 400 if no team with id=id', async () => {
      await koaRequest
        .del('/teams/' + 0)
        .expect(400)
    })
  })
})
