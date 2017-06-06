/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models
let accessToken = process.env.ACCESS_TOKEN

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('achievements', () => {
  context('GET /achievements/team/:team', () => {
    it('should return empty if no achievements for team with id=team', async () => {
      await koaRequest
        .get('/achievements/team/1')
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body.should.deep.equal([])
        })
    })
    it('should return achievements for team with id=team', async () => {
      let t1 = await models.db.team.create({name: 'team1'})
      let a1 = await models.db.achievement.create({name: 'London', distance: 100})
      await models.db.achievements.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .get('/achievements/team/' + t1.id)
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body[0].team_id.should.equal(t1.id)
          response.body[0].achievement_id.should.equal(a1.id)
        })
    })
  })

  context('GET /achievements/achievement/:achievement', () => {
    it('should return empty if no achievements for achievement with id=achievement', async () => {
      await koaRequest
        .get('/achievements/achievement/1')
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body.should.deep.equal([])
        })
    })
    it('should return achievements for achievement with id=achievement', async () => {
      let t1 = await models.db.team.create({name: 'team1'})
      let a1 = await models.db.achievement.create({name: 'London', distance: 100})
      await models.db.achievements.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .get('/achievements/achievement/' + a1.id)
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body[0].team_id.should.equal(t1.id)
          response.body[0].achievement_id.should.equal(a1.id)
        })
    })
  })

  context('POST /achievements', () => {
    it('should create achievements with team=team and achievement=achievement', async () => {
      let t1 = await models.db.team.create({name: 'team1'})
      let a1 = await models.db.achievement.create({name: 'London', distance: 100})
      await koaRequest
        .post('/achievements')
        .set('access_token', accessToken)
        .send({team_id: t1.id, achievement_id: a1.id})
        .expect(201)
        .then(response => {
          response.body.team_id.should.equal(t1.id)
          response.body.achievement_id.should.equal(a1.id)
        })
    })
    it('should return 409 if achievements\' team and achievement conflict', async () => {
      let t1 = await models.db.team.create({name: 'team1'})
      let a1 = await models.db.achievement.create({name: 'London', distance: 100})
      let achievements = await models.db.achievements.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .post('/achievements')
        .set('access_token', accessToken)
        .send({team_id: achievements.team_id, achievement_id: achievements.achievement_id})
        .expect(409, {'error': {
          'code': 409,
          'message': `achievements for team="${achievements.team_id}" and achievement="${achievements.achievement_id}" already exist`
        }})
    })
  })

  context('PATCH /achievements/:id', () => {
    it('should change achievements team and achievement', async () => {
      let t1 = await models.db.team.create({name: 'team1'})
      let t2 = await models.db.team.create({name: 'team2'})
      let a1 = await models.db.achievement.create({name: 'London', distance: 100})
      let a2 = await models.db.achievement.create({name: 'Paris', distance: 200})
      let achievements = await models.db.achievements.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .patch('/achievements/' + achievements.id)
        .set('access_token', accessToken)
        .send({team_id: t2.id, achievement_id: a2.id})
        .expect(200, [1])
    })
    it('should return 400 if no achievements with id=id', async () => {
      await koaRequest
        .patch('/achievements/' + 1)
        .set('access_token', accessToken)
        .send({team_id: 1})
        .expect(400, [0])
    })
    it('should return 400 if achievements\' team and achievement conflict', async () => {
      let t1 = await models.db.team.create({name: 'team1'})
      let t2 = await models.db.team.create({name: 'team2'})
      let a1 = await models.db.achievement.create({name: 'London', distance: 100})
      let a2 = await models.db.achievement.create({name: 'Paris', distance: 200})
      let achievements1 = await models.db.achievements.create({team_id: t1.id, achievement_id: a1.id})
      await models.db.achievements.create({team_id: t2.id, achievement_id: a2.id})
      await koaRequest
        .patch('/achievements/' + achievements1.id)
        .set('access_token', accessToken)
        .send({team_id: t2.id, achievement_id: a2.id})
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

  context('DELETE /achievements/:id', () => {
    it('should delete achievements with id=id', async () => {
      let t1 = await models.db.team.create({name: 'team1'})
      let a1 = await models.db.achievement.create({name: 'London', distance: 100})
      let achievements = await models.db.achievements.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .del('/achievements/' + achievements.id)
        .set('access_token', accessToken)
        .expect(204)
    })
    it('should return 400 if no achievements with id=id', async () => {
      await koaRequest
        .del('/achievements/' + 0)
        .set('access_token', accessToken)
        .expect(400)
    })
  })
})
