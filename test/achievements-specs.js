/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const model = require('./routes-specs').model

beforeEach(function syncDB () {
  return model.db.sequelize.sync({force: true})
})

describe('achievements', () => {
  context('GET /achievements/team/:team', () => {
    it('should return empty if no achievements for team with id=team', async () => {
      await koaRequest
        .get('/achievements/team/1')
        .expect(200)
        .then(response => {
          response.body.should.deep.equal([])
        })
    })
    it('should return achievements for team with id=team', async () => {
      let t1 = await model.db.team.create({name: 'team1'})
      let a1 = await model.db.achievement.create({name: 'London', distance: 100})
      await model.db.achievements.create({team: t1.id, achievement: a1.id})
      await koaRequest
        .get('/achievements/team/' + t1.id)
        .expect(200)
        .then(response => {
          response.body[0].team.should.equal(t1.id)
          response.body[0].achievement.should.equal(a1.id)
        })
    })
  })

  context('GET /achievements/achievement/:achievement', () => {
    it('should return empty if no achievements for achievement with id=achievement', async () => {
      await koaRequest
        .get('/achievements/achievement/1')
        .expect(200)
        .then(response => {
          response.body.should.deep.equal([])
        })
    })
    it('should return achievements for achievement with id=achievement', async () => {
      let t1 = await model.db.team.create({name: 'team1'})
      let a1 = await model.db.achievement.create({name: 'London', distance: 100})
      await model.db.achievements.create({team: t1.id, achievement: a1.id})
      await koaRequest
        .get('/achievements/achievement/' + a1.id)
        .expect(200)
        .then(response => {
          response.body[0].team.should.equal(t1.id)
          response.body[0].achievement.should.equal(a1.id)
        })
    })
  })

  context('POST /achievements', () => {
    it('should create achievements with team=team and achievement=achievement', async () => {
      let t1 = await model.db.team.create({name: 'team1'})
      let a1 = await model.db.achievement.create({name: 'London', distance: 100})
      await koaRequest
        .post('/achievements')
        .send({team: t1.id, achievement: a1.id})
        .expect(201)
        .then(response => {
          response.body.team.should.equal(t1.id)
          response.body.achievement.should.equal(a1.id)
        })
    })
    it('should return 409 if achievements\' team and achievement conflict', async () => {
      let t1 = await model.db.team.create({name: 'team1'})
      let a1 = await model.db.achievement.create({name: 'London', distance: 100})
      let achievements = await model.db.achievements.create({team: t1.id, achievement: a1.id})
      await koaRequest
        .post('/achievements')
        .send({team: achievements.team, achievement: achievements.achievement})
        .expect(409, {'error': {
          'code': 409,
          'message': `achievements for team="${achievements.team}" and achievement="${achievements.achievement}" already exist`
        }})
    })
  })

  context('PATCH /achievements/:id', () => {
    it('should change achievements team and achievement', async () => {
      let t1 = await model.db.team.create({name: 'team1'})
      let t2 = await model.db.team.create({name: 'team2'})
      let a1 = await model.db.achievement.create({name: 'London', distance: 100})
      let a2 = await model.db.achievement.create({name: 'Paris', distance: 200})
      let achievements = await model.db.achievements.create({team: t1.id, achievement: a1.id})
      await koaRequest
        .patch('/achievements/' + achievements.id)
        .send({team: t2.id, achievement: a2.id})
        .expect(200, [1])
    })
    it('should return 400 if no achievements with id=id', async () => {
      await koaRequest
        .patch('/achievements/' + 1)
        .send({team: 1})
        .expect(400, [0])
    })
    it('should return 400 if achievements\' team and achievement conflict', async () => {
      let t1 = await model.db.team.create({name: 'team1'})
      let t2 = await model.db.team.create({name: 'team2'})
      let a1 = await model.db.achievement.create({name: 'London', distance: 100})
      let a2 = await model.db.achievement.create({name: 'Paris', distance: 200})
      let achievements1 = await model.db.achievements.create({team: t1.id, achievement: a1.id})
      await model.db.achievements.create({team: t2.id, achievement: a2.id})
      await koaRequest
        .patch('/achievements/' + achievements1.id)
        .send({team: t2.id, achievement: a2.id})
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

  context('DELETE /achievements/:id', () => {
    it('should delete achievements with id=id', async () => {
      let t1 = await model.db.team.create({name: 'team1'})
      let a1 = await model.db.achievement.create({name: 'London', distance: 100})
      let achievements = await model.db.achievements.create({team: t1.id, achievement: a1.id})
      await koaRequest
        .del('/achievements/' + achievements.id)
        .expect(204)
    })
    it('should return 400 if no achievements with id=id', async () => {
      await koaRequest
        .del('/achievements/' + 0)
        .expect(400)
    })
  })
})
