/* eslint-env mocha */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const request = require('supertest')
const http = require('http')
const server = require('../lib/server.js')


chai.should()
chai.use(chaiAsPromised)

const koaRequest = request(http.createServer(server.callback()));

describe('routes', () => {

  context('GET /', () => {
    it('should respond 200', async () => {
      await koaRequest
        .get('/')
        .expect(200, 'ok')
    })
  })
})
