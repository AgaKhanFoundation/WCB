/* eslint-env mocha */

const chai = require('chai')
const request = require('supertest')
const http = require('http')
const server = require('../lib/server.js')
const models = require('../lib/models')
let accessToken = process.env.ACCESS_TOKEN

chai.should()
chai.use(require('chai-as-promised'))
chai.use(require('chai-moment'))

const koaRequest = request(http.createServer(server.callback()))

describe('routes', () => {
  context('GET /', () => {
    it('should respond 200', async () => {
      await koaRequest
        .get('/')
        .set('access_token', accessToken)
        .expect(200, {'status': 'OK'})
    })
  })
})

module.exports = {koaRequest, models}
