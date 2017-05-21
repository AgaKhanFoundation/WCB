/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('records', () => {
  context('GET /records/:id', () => {
    it('should return 204 if no record with id=id', async () => {
      await koaRequest
        .get('/records/1')
        .expect(204)
    })
    it('should return record with id=id', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let s1 = await models.db.source.create({name: 's1'})
      let l1 = await models.db.record.create({
        date: '2017-02-01T00:00:00Z',
        distance: 1,
        participant_id: p1.id,
        source_id: s1.id
      })
      await koaRequest
        .get('/records/' + l1.id)
        .expect(200)
        .then(response => {
          response.body.date.should.be.sameMoment(l1.date)
          response.body.distance.should.equal(l1.distance)
          response.body.participant_id.should.equal(l1.participant_id)
          response.body.source_id.should.equal(l1.source_id)
        })
    })
  })

  context('POST /records', () => {
    it('should create record with date=date, distance=distance, participant_id=participant_id, source_id=source_id', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let s1 = await models.db.source.create({name: 's1'})
      let date = '2017-02-01T00:00:00Z'
      let distance = 1
      let participantId = p1.id
      let sourceId = s1.id
      await koaRequest
        .post('/records')
        .send({
          date: date,
          distance: distance,
          participant_id: participantId,
          source_id: sourceId
        })
        .expect(201)
        .then(response => {
          response.body.date.should.be.sameMoment(date)
          response.body.distance.should.equal(distance)
          response.body.participant_id.should.equal(participantId)
          response.body.source_id.should.equal(sourceId)
        })
    })
    it('should return 409 if record conflict', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let s1 = await models.db.source.create({name: 's1'})
      let l1 = await models.db.record.create({
        date: '2017-02-01T00:00:00Z',
        distance: 1,
        participant_id: p1.id,
        source_id: s1.id
      })
      await koaRequest
        .post('/records')
        .send({
          date: l1.date,
          distance: l1.distance,
          participant_id: l1.participant_id,
          source_id: l1.source_id
        })
        .expect(409, {'error': {
          'code': 409,
          'message': `specified record already exists`
        }})
    })
  })

  context('DELETE /records/:id', () => {
    it('should delete record with id=id', async () => {
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let s1 = await models.db.source.create({name: 's1'})
      let l1 = await models.db.record.create({
        date: '2017-02-01T00:00:00Z',
        distance: 1,
        participant_id: p1.id,
        source_id: s1.id
      })
      await koaRequest
        .del('/records/' + l1.id)
        .expect(204)
    })
    it('should return 400 if no record with id=id', async () => {
      await koaRequest
        .del('/records/' + 0)
        .expect(400)
    })
  })
})
