/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models
let accessToken = process.env.ACCESS_TOKEN

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('teams', () => {
  context('GET /teams', () => {
    it('should return teams', async () => {
      let team1 = await models.db.team.create({name: 'team1'})
      let team2 = await models.db.team.create({name: 'team2'})
      await koaRequest
        .get('/teams')
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(team1.name)
          response.body[1].name.should.equal(team2.name)
        })
    })
    it('should return teams with participants', async () => {
      let t1 = await models.db.team.create({name: 't1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      await koaRequest
        .get('/teams')
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(t1.name)
          response.body[0].participants[0].fbid.should.equal(p1.fbid)
        })
    })
    it('should return teams with achievements', async () => {
      let t1 = await models.db.team.create({name: 't1'})
      let a1 = await models.db.achievement.create({name: 'a1', distance: 1})
      await models.db.achievements.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .get('/teams')
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(t1.name)
          response.body[0].achievements[0].name.should.equal(a1.name)
          response.body[0].achievements[0].distance.should.equal(a1.distance)
        })
    })
  })

  context('GET /teams/:id', () => {
    it('should return 204 if no team with id=id', async () => {
      await koaRequest
        .get('/teams/1')
        .set('access_token', accessToken)
        .expect(204)
    })
    it('should return team with id=id', async () => {
      let team = await models.db.team.create({name: 'team1'})
      await koaRequest
        .get('/teams/' + team.id)
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(team.name)
        })
    })
    it('should return team with id=id with participants', async () => {
      let t1 = await models.db.team.create({name: 't1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      await koaRequest
        .get('/teams/' + t1.id)
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(t1.name)
          response.body.participants[0].fbid.should.equal(p1.fbid)
        })
    })
    it('should return team with id=id with achievements', async () => {
      let t1 = await models.db.team.create({name: 't1'})
      let a1 = await models.db.achievement.create({name: 'a1', distance: 1})
      await models.db.achievements.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .get('/teams/' + t1.id)
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(t1.name)
          response.body.achievements[0].name.should.equal(a1.name)
          response.body.achievements[0].distance.should.equal(a1.distance)
        })
    })
  })

  context('GET /teams/:id/stats', () => {
    it('should return 204 if no team with id=id', async () => {
      await koaRequest
        .get('/teams/1/stats')
        .set('access_token', accessToken)
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
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body.distance.should.equal(r1.distance + r2.distance)
        })
    })
  })

  context('POST /teams', () => {
    it('should create team with name=name', async () => {
      let name = 'team1'
      await koaRequest
        .post('/teams')
        .set('access_token', accessToken)
        .send({name})
        .expect(201)
        .then(response => {
          response.body.name.should.equal(name)
        })
    })
    it('should return 409 if team name conflict', async () => {
      let team2 = await models.db.team.create({name: 'team2'})
      await koaRequest
        .post('/teams')
        .set('access_token', accessToken)
        .send({name: team2.name})
        .expect(409, {'error': {
          'code': 409,
          'message': `team named "${team2.name}" already exists`
        }})
    })
  })

  context('PATCH /teams/:id', () => {
    it('should change team name', async () => {
      let team = await models.db.team.create({name: 'team1'})
      await koaRequest
        .patch('/teams/' + team.id)
        .set('access_token', accessToken)
        .send({name: 'firstTeam'})
        .expect(200, [1])
    })
    it('should return 400 if no team with id=id', async () => {
      await koaRequest
        .patch('/teams/' + 1)
        .set('access_token', accessToken)
        .send({name: 't2'})
        .expect(400, [0])
    })
    it('should return 400 if team name conflict', async () => {
      let team2 = await models.db.team.create({name: 'team2'})
      let team3 = await models.db.team.create({name: 'team3'})
      await koaRequest
        .patch('/teams/' + team2.id)
        .set('access_token', accessToken)
        .send({name: team3.name})
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

  context('DELETE /teams/:id', () => {
    it('should delete team with id=id', async () => {
      let team = await models.db.team.create({name: 'team1'})
      await koaRequest
        .del('/teams/' + team.id)
        .set('access_token', accessToken)
        .expect(204)
    })
    it('should return 400 if no team with id=id', async () => {
      await koaRequest
        .del('/teams/' + 0)
        .set('access_token', accessToken)
        .expect(400)
    })
  })
})
