/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('localities', () => {
  context('GET /localities', () => {
    it('should return localities', async () => {
      let l1 = await models.db.locality.create({name: 'l1'})
      let l2 = await models.db.locality.create({name: 'l2'})
      await koaRequest
        .get('/localities')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(l1.name)
          response.body[1].name.should.equal(l2.name)
        })
    })
  })

  context('GET /localities/:id', () => {
    it('should return 204 if no locality with id=id', async () => {
      await koaRequest
        .get('/localities/1')
        .expect(204)
    })
    it('should return locality with id=id', async () => {
      let l1 = await models.db.locality.create({name: 'l1'})
      await koaRequest
        .get('/localities/' + l1.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(l1.name)
        })
    })
  })

  context('POST /localities', () => {
    it('should create locality with name=name', async () => {
      let name = 'l1'
      await koaRequest
        .post('/localities')
        .send({name})
        .expect(201)
        .then(response => {
          response.body.name.should.equal(name)
        })
    })
    it('should return 409 if locality name conflict', async () => {
      let l2 = await models.db.locality.create({name: 'l2'})
      await koaRequest
        .post('/localities')
        .send({name: l2.name})
        .expect(409, {'error': {
          'code': 409,
          'message': `locality named "${l2.name}" already exists`
        }})
    })
  })

  context('PATCH /localities/:id', () => {
    it('should change locality name', async () => {
      let l1 = await models.db.locality.create({name: 'l1'})
      await koaRequest
        .patch('/localities/' + l1.id)
        .send({name: 'l2'})
        .expect(200, [1])
    })
    it('should return 400 if no locality with id=id', async () => {
      await koaRequest
        .patch('/localities/' + 1)
        .send({name: 'l2'})
        .expect(400, [0])
    })
    it('should return 400 if locality name conflict', async () => {
      let l2 = await models.db.locality.create({name: 'l2'})
      let l3 = await models.db.locality.create({name: 'l3'})
      await koaRequest
        .patch('/localities/' + l2.id)
        .send({name: l3.name})
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

  context('DELETE /localities/:id', () => {
    it('should delete locality with id=id', async () => {
      let l1 = await models.db.locality.create({name: 'l1'})
      await koaRequest
        .del('/localities/' + l1.id)
        .expect(204)
    })
    it('should return 400 if no locality with id=id', async () => {
      await koaRequest
        .del('/localities/' + 0)
        .expect(400)
    })
  })
})
