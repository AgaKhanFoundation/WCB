/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('events', () => {
  context('GET /events', () => {
    it('should return events', async () => {
      let e1 = await models.db.event.create({
        name: 'e1',
        image: 'i1',
        description: 'event 1',
        start_date: '2017-02-01T00:00:00Z',
        end_date: '2017-12-31T00:00:00Z',
        team_limit: 10,
        team_building_start: '2017-01-01T00:00:00Z',
        team_building_end: '2017-01-31T00:00:00Z',
        default_steps: 10000
      })
      let e2 = await models.db.event.create({
        name: 'e2',
        image: 'i2',
        description: 'event 2',
        start_date: '2017-02-01T00:00:00Z',
        end_date: '2017-12-31T00:00:00Z',
        team_limit: 10,
        team_building_start: '2017-01-01T00:00:00Z',
        team_building_end: '2017-01-31T00:00:00Z',
        default_steps: 10000
      })
      await koaRequest
        .get('/events')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(e1.name)
          response.body[0].image.should.equal(e1.image)
          response.body[0].description.should.equal(e1.description)
          response.body[0].start_date.should.be.sameMoment(e1.start_date)
          response.body[0].end_date.should.be.sameMoment(e1.end_date)
          response.body[0].team_limit.should.equal(e1.team_limit)
          response.body[0].team_building_start.should.be.sameMoment(e1.team_building_start)
          response.body[0].team_building_end.should.be.sameMoment(e1.team_building_end)
          response.body[0].default_steps.should.equal(e1.default_steps)
          response.body[1].name.should.equal(e2.name)
          response.body[1].image.should.equal(e2.image)
          response.body[1].description.should.equal(e2.description)
          response.body[1].start_date.should.be.sameMoment(e2.start_date)
          response.body[1].end_date.should.be.sameMoment(e2.end_date)
          response.body[1].team_limit.should.equal(e2.team_limit)
          response.body[1].team_building_start.should.be.sameMoment(e2.team_building_start)
          response.body[1].team_building_end.should.be.sameMoment(e2.team_building_end)
          response.body[1].default_steps.should.equal(e2.default_steps)
        })
    })
  })

  context('GET /events/:id', () => {
    it('should return 204 if no event with id=id', async () => {
      await koaRequest
        .get('/events/1')
        .expect(204)
    })
    it('should return event with id=id', async () => {
      let e1 = await models.db.event.create({
        name: 'e1',
        image: 'i1',
        description: 'event 1',
        start_date: '2017-02-01T00:00:00Z',
        end_date: '2017-12-31T00:00:00Z',
        team_limit: 10,
        team_building_start: '2017-01-01T00:00:00Z',
        team_building_end: '2017-01-31T00:00:00Z',
        default_steps: 10000
      })
      await koaRequest
        .get('/events/' + e1.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(e1.name)
          response.body.image.should.equal(e1.image)
          response.body.description.should.equal(e1.description)
          response.body.start_date.should.be.sameMoment(e1.start_date)
          response.body.end_date.should.be.sameMoment(e1.end_date)
          response.body.team_limit.should.equal(e1.team_limit)
          response.body.team_building_start.should.be.sameMoment(e1.team_building_start)
          response.body.team_building_end.should.be.sameMoment(e1.team_building_end)
          response.body.default_steps.should.equal(e1.default_steps)
        })
    })
  })

  context('POST /events', () => {
    it('should create event with name=name', async () => {
      let name = 'e1'
      let image = 'i1'
      let description = 'event 1'
      let startDate = '2017-02-01T00:00:00Z'
      let endDate = '2017-12-31T00:00:00Z'
      let teamLimit = 10
      let teamBuildingStart = '2017-01-01T00:00:00Z'
      let teamBuildingEnd = '2017-01-31T00:00:00Z'
      let defaultSteps = 10000
      await koaRequest
        .post('/events')
        .send({
          name,
          image,
          description,
          start_date: startDate,
          end_date: endDate,
          team_limit: teamLimit,
          team_building_start: teamBuildingStart,
          team_building_end: teamBuildingEnd,
          default_steps: defaultSteps
        })
        .expect(201)
        .then(response => {
          response.body.name.should.equal(name)
          response.body.image.should.equal(image)
          response.body.description.should.equal(description)
          response.body.start_date.should.be.sameMoment(startDate)
          response.body.end_date.should.be.sameMoment(endDate)
          response.body.team_limit.should.equal(teamLimit)
          response.body.team_building_start.should.be.sameMoment(teamBuildingStart)
          response.body.team_building_end.should.be.sameMoment(teamBuildingEnd)
          response.body.default_steps.should.equal(defaultSteps)
        })
    })
    it('should return 409 if event name conflict', async () => {
      let name = 'e1'
      let image = 'i1'
      let description = 'event 1'
      let startDate = '2017-02-01T00:00:00Z'
      let endDate = '2017-12-31T00:00:00Z'
      let teamLimit = 10
      let teamBuildingStart = '2017-01-01T00:00:00Z'
      let teamBuildingEnd = '2017-01-31T00:00:00Z'
      let defaultSteps = 10000
      let e1 = await models.db.event.create({
        name,
        image,
        description,
        start_date: startDate,
        end_date: endDate,
        team_limit: teamLimit,
        team_building_start: teamBuildingStart,
        team_building_end: teamBuildingEnd,
        default_steps: defaultSteps
      })
      await koaRequest
        .post('/events')
        .send({
          name: 'e1',
          image: 'i2',
          description: 'event 2',
          start_date: '2018-02-01T00:00:00Z',
          end_date: '2018-12-31T00:00:00Z',
          team_limit: teamLimit,
          team_building_start: '2018-01-01T00:00:00Z',
          team_building_end: '2018-01-31T00:00:00Z',
          default_steps: defaultSteps
        })
        .expect(409, {'error': {
          'code': 409,
          'message': `event named "${e1.name}" already exists`
        }})
    })
  })

  context('PATCH /events/:id', () => {
    it('should change event name, image, description, start_date, end_date, team_limit, team_building_start, team_building_end, default_steps', async () => {
      let e1 = await models.db.event.create({
        name: 'e1',
        image: 'i1',
        description: 'event 1',
        start_date: '2017-02-01T00:00:00Z',
        end_date: '2017-12-31T00:00:00Z',
        team_limit: 10,
        team_building_start: '2017-01-01T00:00:00Z',
        team_building_end: '2017-01-31T00:00:00Z',
        default_steps: 10000
      })
      await koaRequest
        .patch('/events/' + e1.id)
        .send({
          name: 'e2',
          image: 'i2',
          description: 'event 2',
          startDate: '2018-02-01T00:00:00Z',
          endDate: '2018-12-31T00:00:00Z',
          teamLimit: 20,
          teamBuildingStart: '2018-01-01T00:00:00Z',
          teamBuildingEnd: '2018-01-31T00:00:00Z',
          default_steps: 20000
        })
        .expect(200, [1])
    })
    it('should return 400 if no event with id=id', async () => {
      await koaRequest
        .patch('/events/' + 1)
        .send({name: 'e2'})
        .expect(400, [0])
    })
    it('should return 400 if event name conflict', async () => {
      let e2 = await models.db.event.create({
        name: 'e2',
        image: 'i2',
        description: 'event 2',
        start_date: '2017-02-01T00:00:00Z',
        end_date: '2017-12-31T00:00:00Z',
        team_limit: 10,
        team_building_start: '2017-01-01T00:00:00Z',
        team_building_end: '2017-01-31T00:00:00Z',
        default_steps: 10000
      })
      let e3 = await models.db.event.create({
        name: 'e3',
        image: 'i3',
        description: 'event 3',
        start_date: '2017-02-01T00:00:00Z',
        end_date: '2017-12-31T00:00:00Z',
        team_limit: 10,
        team_building_start: '2017-01-01T00:00:00Z',
        team_building_end: '2017-01-31T00:00:00Z',
        default_steps: 10000
      })
      await koaRequest
        .patch('/events/' + e2.id)
        .send({name: e3.name})
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

  context('DELETE /events/:id', () => {
    it('should delete event with id=id', async () => {
      let e1 = await models.db.event.create({
        name: 'e1',
        image: 'i1',
        description: 'event 1',
        start_date: '2017-02-01T00:00:00Z',
        end_date: '2017-12-31T00:00:00Z',
        team_limit: 10,
        team_building_start: '2017-01-01T00:00:00Z',
        team_building_end: '2017-01-31T00:00:00Z',
        default_steps: 10000
      })
      await koaRequest
        .del('/events/' + e1.id)
        .expect(204)
    })
    it('should return 400 if no event with id=id', async () => {
      await koaRequest
        .del('/events/' + 0)
        .expect(400)
    })
  })
})
