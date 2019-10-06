/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('commitments', () => {
  context('GET /commitments/participant/:fbid', () => {
    it('should return 204 if no participant found with fbid=fbid', async () => {
      await koaRequest
        .get('/commitments/participant/p0')
        .expect(204)
    })
    it('should return empty if no commitments for participant with fbid=fbid', async () => {
      await models.db.participant.create({fbid: 'p1'})
      await koaRequest
        .get('/commitments/participant/p1')
        .expect(200)
        .then(response => {
          response.body.should.deep.equal([])
        })
    })
    it('should return commitments for participant with fbid=fbid', async () => {
      let p2 = await models.db.participant.create({fbid: 'p2'})
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
      await models.db.participant_event.create({participant_id: p2.id, event_id: e1.id, commitment: 100000})
      await koaRequest
        .get('/commitments/participant/p2')
        .expect(200)
        .then(response => {
          response.body[0].participant_id.should.equal(p2.id)
          response.body[0].event_id.should.equal(e1.id)
          response.body[0].commitment.should.equal(100000)
        })
    })
  })

  context('GET /commitments/event/:event', () => {
    it('should return empty if no commitments for event with id=event', async () => {
      await koaRequest
        .get('/commitments/event/1')
        .expect(200)
        .then(response => {
          response.body.should.deep.equal([])
        })
    })
    it('should return commitments for event with id=event', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
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
      await models.db.participant_event.create({participant_id: p1.id, event_id: e1.id, commitment: 100000})
      await koaRequest
        .get('/commitments/event/' + e1.id)
        .expect(200)
        .then(response => {
          response.body[0].participant_id.should.equal(p1.id)
          response.body[0].event_id.should.equal(e1.id)
          response.body[0].commitment.should.equal(100000)
        })
    })
  })

  context('POST /commitments', () => {
    it('should return 400 if participant is not found', async () => {
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
        .post('/commitments')
        .send({fbid: 'p1', event_id: e1.id, commitment: 100000})
        .expect(400)
    })
    it('should create commitments with participant=participant and event=event', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
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
        .post('/commitments')
        .send({fbid: p1.fbid, event_id: e1.id, commitment: 100000})
        .expect(201)
        .then(response => {
          response.body.participant_id.should.equal(p1.id)
          response.body.event_id.should.equal(e1.id)
          response.body.commitment.should.equal(100000)
        })
    })
    it('should return 409 if commitments\' participant and event conflict', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
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
      let commitments = await models.db.participant_event.create({participant_id: p1.id, event_id: e1.id, commitment: 100000})
      await koaRequest
        .post('/commitments')
        .send({fbid: p1.fbid, event_id: commitments.event_id})
        .expect(409, {'error': {
          'code': 409,
          'message': `commitments for participant with fbid="${p1.fbid}" and event="${commitments.event_id}" already exist`
        }})
    })
  })

  context('PATCH /commitments/:id', () => {
    it('should change commitments participant and event', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let p2 = await models.db.participant.create({fbid: 'p2'})
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
      let commitments = await models.db.participant_event.create({participant_id: p1.id, event_id: e1.id})
      await koaRequest
        .patch('/commitments/' + commitments.id)
        .send({participant_id: p2.id, event_id: e2.id})
        .expect(200, [1])
    })
    it('should return 400 if no commitments with id=id', async () => {
      await koaRequest
        .patch('/commitments/' + 1)
        .send({participant_id: 1})
        .expect(400, [0])
    })
    it('should return 400 if commitments\' participant and event conflict', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let p2 = await models.db.participant.create({fbid: 'p2'})
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
      let commitments1 = await models.db.participant_event.create({participant_id: p1.id, event_id: e1.id})
      await models.db.participant_event.create({participant_id: p2.id, event_id: e2.id})
      await koaRequest
        .patch('/commitments/' + commitments1.id)
        .send({participant_id: p2.id, event_id: e2.id})
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

  context('DELETE /commitments/:id', () => {
    it('should delete commitments with id=id', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
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
      let commitments = await models.db.participant_event.create({participant_id: p1.id, event_id: e1.id})
      await koaRequest
        .del('/commitments/' + commitments.id)
        .expect(204)
    })
    it('should return 400 if no commitments with id=id', async () => {
      await koaRequest
        .del('/commitments/' + 0)
        .expect(400)
    })
  })
})
