/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models
let accessToken = process.env.ACCESS_TOKEN

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('sources', () => {
  context('GET /sources', () => {
    it('should return sources', async () => {
      let s1 = await models.db.source.create({name: 's1'})
      let s2 = await models.db.source.create({name: 's2'})
      await koaRequest
        .get('/sources')
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(s1.name)
          response.body[1].name.should.equal(s2.name)
        })
    })
  })

  context('GET /sources/:id', () => {
    it('should return 204 if no source with id=id', async () => {
      await koaRequest
        .get('/sources/1')
        .set('access_token', accessToken)
        .expect(204)
    })
    it('should return source with id=id', async () => {
      let s1 = await models.db.source.create({name: 's1'})
      await koaRequest
        .get('/sources/' + s1.id)
        .set('access_token', accessToken)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(s1.name)
        })
    })
  })

  context('POST /sources', () => {
    it('should create source with name=name', async () => {
      let name = 's1'
      await koaRequest
        .post('/sources')
        .set('access_token', accessToken)
        .send({name})
        .expect(201)
        .then(response => {
          response.body.name.should.equal(name)
        })
    })
    it('should return 409 if source name conflict', async () => {
      let s2 = await models.db.source.create({name: 's2'})
      await koaRequest
        .post('/sources')
        .set('access_token', accessToken)
        .send({name: s2.name})
        .expect(409, {'error': {
          'code': 409,
          'message': `source named "${s2.name}" already exists`
        }})
    })
  })

  context('PATCH /sources/:id', () => {
    it('should change source name', async () => {
      let s1 = await models.db.source.create({name: 's1'})
      await koaRequest
        .patch('/sources/' + s1.id)
        .set('access_token', accessToken)
        .send({name: 's2'})
        .expect(200, [1])
    })
    it('should return 400 if no source with id=id', async () => {
      await koaRequest
        .patch('/sources/' + 1)
        .set('access_token', accessToken)
        .send({name: 's2'})
        .expect(400, [0])
    })
    it('should return 400 if source name conflict', async () => {
      let s2 = await models.db.source.create({name: 's2'})
      let s3 = await models.db.source.create({name: 's3'})
      await koaRequest
        .patch('/sources/' + s2.id)
        .set('access_token', accessToken)
        .send({name: s3.name})
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

  context('DELETE /sources/:id', () => {
    it('should delete source with id=id', async () => {
      let s1 = await models.db.source.create({name: 's1'})
      await koaRequest
        .del('/sources/' + s1.id)
        .set('access_token', accessToken)
        .expect(204)
    })
    it('should return 400 if no source with id=id', async () => {
      await koaRequest
        .del('/sources/' + 0)
        .set('access_token', accessToken)
        .expect(400)
    })
  })
})
