/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const model = require('./routes-specs').model

beforeEach(function syncDB () {
  return model.db.sequelize.sync({force: true})
})

describe('achievement', () => {
  context('GET /achievement', () => {
    it('should return achievements', async () => {
      let a1 = await model.db.achievement.create({name: 'London', distance: 100})
      let a2 = await model.db.achievement.create({name: 'Paris', distance: 200})
      await koaRequest
        .get('/achievement')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(a1.name)
          response.body[0].distance.should.equal(a1.distance)
          response.body[1].name.should.equal(a2.name)
          response.body[1].distance.should.equal(a2.distance)
        })
    })
    it('should return achievements with teams', async () => {
      let a1 = await model.db.achievement.create({name: 'a1', distance: 1})
      let t1 = await model.db.team.create({name: 't1'})
      await model.db.achievements.create({team: t1.id, achievement: a1.id})
      await koaRequest
        .get('/achievement')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(a1.name)
          response.body[0].distance.should.equal(a1.distance)
          response.body[0].teams[0].name.should.equal(t1.name)
        })
    })
  })

  context('GET /achievement/:id', () => {
    it('should return 204 if no achievement with id=id', async () => {
      await koaRequest
        .get('/achievement/1')
        .expect(204)
    })
    it('should return achievement with id=id', async () => {
      let achievement = await model.db.achievement.create({name: 'London', distance: 100})
      await koaRequest
        .get('/achievement/' + achievement.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(achievement.name)
          response.body.distance.should.equal(achievement.distance)
        })
    })
    it('should return achievement with id=id with teams', async () => {
      let a1 = await model.db.achievement.create({name: 'a1', distance: 1})
      let t1 = await model.db.team.create({name: 't1'})
      await model.db.achievements.create({team: t1.id, achievement: a1.id})
      await koaRequest
        .get('/achievement/' + a1.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(a1.name)
          response.body.distance.should.equal(a1.distance)
          response.body.teams[0].name.should.equal(t1.name)
        })
    })
  })

  context('POST /achievement', () => {
    it('should create achievement with name=name and distance=distance', async () => {
      let name = 'London'
      let distance = 100
      await koaRequest
        .post('/achievement')
        .send({name, distance})
        .expect(201)
        .then(response => {
          response.body.name.should.equal(name)
          response.body.distance.should.equal(distance)
        })
    })
    it('should return 409 if achievement name conflict', async () => {
      let a2 = await model.db.achievement.create({name: 'Paris', distance: 100})
      await koaRequest
        .post('/achievement')
        .send({name: a2.name, distance: a2.distance})
        .expect(409, {'error': {
          'code': 409,
          'message': `achievement named "${a2.name}" already exists`
        }})
    })
  })

  context('PATCH /achievement/:id', () => {
    it('should change achievement name and distance', async () => {
      let achievement = await model.db.achievement.create({name: 'London', distance: 100})
      await koaRequest
        .patch('/achievement/' + achievement.id)
        .send({name: 'Paris', distance: 200})
        .expect(200, [1])
    })
    it('should return 400 if no achievement with id=id', async () => {
      await koaRequest
        .patch('/achievement/' + 1)
        .send({name: 'a2'})
        .expect(400, [0])
    })
    it('should return 400 if achievement name conflict', async () => {
      let a2 = await model.db.achievement.create({name: 'Paris', distance: 200})
      let a3 = await model.db.achievement.create({name: 'Amsterdam', distance: 300})
      await koaRequest
        .patch('/achievement/' + a2.id)
        .send({name: a3.name})
        .expect(400, {'error': {
          'code': 400,
          'message': `Validation error`
        }})
    })
  })

  context('DELETE /achievement/:id', () => {
    it('should delete achievement with id=id', async () => {
      let achievement = await model.db.achievement.create({name: 'London', distance: 100})
      await koaRequest
        .del('/achievement/' + achievement.id)
        .expect(204)
    })
    it('should return 400 if no achievement with id=id', async () => {
      await koaRequest
        .del('/achievement/' + 0)
        .expect(400)
    })
  })
})
