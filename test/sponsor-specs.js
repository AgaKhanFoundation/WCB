/* eslint-env mocha */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const request = require('supertest')
const http = require('http')
const server = require('../lib/server.js')
const model = require('../lib/models')

chai.should()
chai.use(chaiAsPromised)

const koaRequest = request(http.createServer(server.callback()))

describe('sponsor', () => {

  context('GET /sponsor', () => {
    before(() => {
      return model.db.sequelize.sync({force: true})
    })
    it('should return empty array if no sponsors', async () => {
      await koaRequest
        .get('/sponsor')
        .expect(200)
        .then(response => {
          response.body.length.should.equal(0)
        })
    })
    it('should return sponsors', async () => {
      let sponsor1 = await model.db.sponsor.create({"name":"Kaiser NC",
        "luminate_id": "001"})
      let sponsor2 = await model.db.sponsor.create({"name":"Sutter Health",
        "luminate_id": "002"})
      await koaRequest
        .get('/sponsor')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(sponsor1.name)
          response.body[0].luminate_id.should.equal(sponsor1.luminate_id)
          response.body[1].name.should.equal(sponsor2.name)
          response.body[1].luminate_id.should.equal(sponsor2.luminate_id)
        })
    })
  })

  context('GET /sponsor/:id', () => {
    before(() => {
      return model.db.sequelize.sync({force: true})
    })
    it('should return 204 if no sponsor with id=id', async () => {
      await koaRequest
        .get('/sponsor/1')
        .expect(204)
    })
    it('should return sponsor with id=id', async () => {
      let sponsor = await model.db.sponsor.create({"name":"Kaiser NC",
        "luminate_id": "001"})
      await koaRequest
        .get('/sponsor/' + sponsor.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(sponsor.name)
          response.body.luminate_id.should.equal(sponsor.luminate_id)
        })
    })
  })

  context('POST /sponsor', () => {
    before(() => {
      return model.db.sequelize.sync({force: true})
    })
    it('should create sponsor with name=name and luminate_id=luminate_id', async () => {
      let body = {"name":"Blue Shield","luminate_id": "003"}
      await koaRequest
        .post('/sponsor')
        .send(body)
        .expect(201)
        .then(response => {
          response.body.name.should.equal(body.name)
          response.body.luminate_id.should.equal(body.luminate_id)
        })
    })
    it('should return 400 if sponsor name conflict', async () => {
      let sponsor1 = {"name":"Kaiser NC", "luminate_id": "001"}
      let duplicateNameReq = {"name":"Kaiser NC", "luminate_id": "002"}
      let sponsor = await model.db.sponsor.create(sponsor1)
      await koaRequest
        .post('/sponsor')
        .send(duplicateNameReq)
        .expect(400)
    })
    it('should return 400 if sponsor luminate id conflict', async () => {
      let sponsor1 = {"name":"Cigna", "luminate_id": "004"}
      let duplicateLuminateReq = {"name":"Sutter Health", "luminate_id": "004"}
      let sponsor = await model.db.sponsor.create(sponsor1)
      await koaRequest
        .post('/sponsor')
        .send(duplicateLuminateReq)
        .expect(400)
    })
  })

  context('DELETE /sponsor/:id', () => {
    before(() => {
      return model.db.sequelize.sync({force: true})
    })
    it('should delete sponsor with id=id', async () => {
      let sponsor = await model.db.sponsor.create({"name":"Kaiser NC",
        "luminate_id": "001"})
      await koaRequest
        .del('/sponsor/' + sponsor.id)
        .expect(204)
    })
    it('should return 400 if no sponsor with id=id', async () => {
      await koaRequest
        .del('/sponsor/' + 0)
        .expect(400)
        .then(response => {
          response.body.should.equal(0)
        })
    })
  })
})
