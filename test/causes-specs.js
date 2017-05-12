/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const model = require('./routes-specs').model

beforeEach(function syncDB () {
  return model.db.sequelize.sync({force: true})
})

describe('causes', () => {
  context('GET /causes', () => {
    it('should return causes', async () => {
      let c1 = await model.db.cause.create({name: 'c1'})
      let c2 = await model.db.cause.create({name: 'c2'})
      await koaRequest
        .get('/causes')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(c1.name)
          response.body[1].name.should.equal(c2.name)
        })
    })
  })

  context('GET /causes/:id', () => {
    it('should return 204 if no cause with id=id', async () => {
      await koaRequest
        .get('/causes/1')
        .expect(204)
    })
    it('should return cause with id=id', async () => {
      let c1 = await model.db.cause.create({name: 'c1'})
      await koaRequest
        .get('/causes/' + c1.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(c1.name)
        })
    })
  })

  context('POST /causes', () => {
    it('should create cause with name=name', async () => {
      let name = 'c1'
      await koaRequest
        .post('/causes')
        .send({name})
        .expect(201)
        .then(response => {
          response.body.name.should.equal(name)
        })
    })
    it('should return 409 if cause name conflict', async () => {
      let c2 = await model.db.cause.create({name: 'c2'})
      await koaRequest
        .post('/causes')
        .send({name: c2.name})
        .expect(409, {'error': {
          'code': 409,
          'message': `cause named "${c2.name}" already exists`
        }})
    })
  })

  context('PATCH /causes/:id', () => {
    it('should change cause name', async () => {
      let c1 = await model.db.cause.create({name: 'c1'})
      await koaRequest
        .patch('/causes/' + c1.id)
        .send({name: 'c2'})
        .expect(200, [1])
    })
    it('should return 400 if no cause with id=id', async () => {
      await koaRequest
        .patch('/causes/' + 1)
        .send({name: 'c2'})
        .expect(400, [0])
    })
    it('should return 400 if cause name conflict', async () => {
      let c2 = await model.db.cause.create({name: 'c2'})
      let c3 = await model.db.cause.create({name: 'c3'})
      await koaRequest
        .patch('/causes/' + c2.id)
        .send({name: c3.name})
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

  context('DELETE /causes/:id', () => {
    it('should delete cause with id=id', async () => {
      let c1 = await model.db.cause.create({name: 'c1'})
      await koaRequest
        .del('/causes/' + c1.id)
        .expect(204)
    })
    it('should return 400 if no cause with id=id', async () => {
      await koaRequest
        .del('/causes/' + 0)
        .expect(400)
    })
  })
})
