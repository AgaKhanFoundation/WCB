/* eslint-env mocha */

const chai = require('chai')
const defaults = require('superagent-defaults')
const request = require('supertest')
const http = require('http')
const server = require('../lib/server.js')
const models = require('../lib/models')

chai.should()
chai.use(require('chai-as-promised'))
chai.use(require('chai-moment'))

const koaRequest = defaults(request(http.createServer(server.callback())))
koaRequest.auth(null, process.env.SERVER_PASSWORD)

describe('routes', () => {
  context('GET /', () => {
    it('should respond 200', async () => {
      await koaRequest
        .get('/')
        .expect(200, {'status': 'OK'})
    })
  })
})

module.exports = {koaRequest, models}
