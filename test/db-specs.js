/* eslint-env mocha */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const model = require('../lib/models')

chai.should()
chai.use(chaiAsPromised)

beforeEach(function syncDB () {
  return model.db.sequelize.sync({force: true})
})

describe('Team model', () => {
  it('should save team', async () => {
    let team = await model.db.team.create({id: 1, name: 'abc'})
    team['name'].should.equal('abc')
  })
})
