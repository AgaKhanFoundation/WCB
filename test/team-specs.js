/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const model = require('./routes-specs').model

beforeEach(function syncDB () {
  return model.db.sequelize.sync({force: true})
})

describe('team', () => {
  context('GET /teams', () => {
    it('should return teams', async () => {
      let team1 = await model.db.team.create({name: 'team1'})
      let team2 = await model.db.team.create({name: 'team2'})
      await koaRequest
        .get('/teams')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(team1.name)
          response.body[1].name.should.equal(team2.name)
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
      let team = await model.db.team.create({name: 'team1'})
      await koaRequest
        .get('/teams/' + team.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(team.name)
        })
    })
  })

  context('POST /teams', () => {
    it('should create team with name=name', async () => {
      let name = 'team1'
      await koaRequest
        .post('/teams')
        .send({name})
        .expect(201)
        .then(response => {
          response.body.name.should.equal(name)
        })
    })
    it('should return 409 if team name conflict', async () => {
      let team2 = await model.db.team.create({name: 'team2'})
      await koaRequest
        .post('/teams')
        .send({name: team2.name})
        .expect(409, `Team named "${team2.name}" already exists!`)
    })
  })

  context('PATCH /teams/:id', () => {
    it('should change team name', async () => {
      let team = await model.db.team.create({name: 'team1'})
      await koaRequest
        .patch('/teams/' + team.id)
        .send({name: 'firstTeam'})
        .expect(200, [1])
    })
    it('should return 400 if team name conflict', async () => {
      let team2 = await model.db.team.create({name: 'team2'})
      let team3 = await model.db.team.create({name: 'team3'})
      await koaRequest
        .patch('/teams/' + team2.id)
        .send({name: team3.name})
        .expect(400, 'Validation error')
    })
  })

  context('DELETE /teams/:id', () => {
    it('should delete team with id=id', async () => {
      let team = await model.db.team.create({name: 'team1'})
      await koaRequest
        .del('/teams/' + team.id)
        .expect(204)
    })
    it('should return 400 if no team with id=id', async () => {
      await koaRequest
        .patch('/teams/' + 0)
        .expect(400)
    })
  })
})
