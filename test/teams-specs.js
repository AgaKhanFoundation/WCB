/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

async function createEvent (name) {
  return models.db.event.create({
    name: name,
    image: 'i1',
    description: 'event 1',
    start_date: '2017-02-01T00:00:00Z',
    end_date: '2017-12-31T00:00:00Z',
    team_limit: 10,
    team_building_start: '2017-01-01T00:00:00Z',
    team_building_end: '2017-01-31T00:00:00Z',
    default_steps: 10000
  })
}

describe('teams', () => {
  context('GET /teams', () => {
    it('should return teams', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      let t2 = await models.db.team.create({name: 't2', image: 'i2', hidden: true})
      let t3 = await models.db.team.create({name: 't3', image: 'i3', hidden: false})
      await koaRequest
        .get('/teams')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(t1.name)
          response.body[0].image.should.equal(t1.image)
          response.body[0].hidden.should.equal(t1.hidden)
          response.body[1].name.should.equal(t2.name)
          response.body[1].image.should.equal(t2.image)
          response.body[1].hidden.should.equal(t2.hidden)
          response.body[2].name.should.equal(t3.name)
          response.body[2].image.should.equal(t3.image)
          response.body[2].hidden.should.equal(t3.hidden)
        })
    })
    it('should return teams with participants', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      await koaRequest
        .get('/teams')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(t1.name)
          response.body[0].image.should.equal(t1.image)
          response.body[0].participants[0].fbid.should.equal(p1.fbid)
        })
    })
    it('should return teams with achievements', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      let a1 = await models.db.achievement.create({sequence: 1, name: 'a1', distance: 1})
      await models.db.team_achievement.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .get('/teams')
        .expect(200)
        .then(response => {
          response.body[0].name.should.equal(t1.name)
          response.body[0].image.should.equal(t1.image)
          response.body[0].achievements[0].sequence.should.equal(a1.sequence)
          response.body[0].achievements[0].name.should.equal(a1.name)
          response.body[0].achievements[0].distance.should.equal(a1.distance)
        })
    })
  })

  context('GET /teams/stats/:event', () => {
    it('should return 204 if no event with id=id', async () => {
      await koaRequest
        .get('/teams/stats/1')
        .expect(204)
    })
    it('should return empty array if no teams', async () => {
      await createEvent('e1')
      await koaRequest
        .get('/teams/stats/1')
        .expect(200)
        .then(response => {
          response.body.should.deep.equal([])
        })
    })
    it('should return zero distance and zero commitment for team with no records or commitments', async () => {
      let e1 = await createEvent('e1')
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      await koaRequest
        .get('/teams/stats/' + e1.id)
        .expect(200)
        .then(response => {
          response.body[0].id.should.equal(t1.id)
          response.body[0].name.should.equal(t1.name)
          response.body[0].image.should.equal(t1.image)
          response.body[0].hidden.should.equal(t1.hidden)
          response.body[0].distance.should.equal(0)
          response.body[0].commitment.should.equal(0)
        })
    })
    it('should return participant distance for team with single participant', async () => {
      let e1 = await createEvent('e1')
      let t1 = await models.db.team.create({name: 't1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      let s1 = await models.db.source.create({name: 's1'})
      let r1 = await models.db.record.create({
        date: '2017-02-01T00:00:00Z',
        distance: 10,
        participant_id: p1.id,
        source_id: s1.id
      })
      let r2 = await models.db.record.create({
        date: '2017-02-02T00:00:00Z',
        distance: 20,
        participant_id: p1.id,
        source_id: s1.id
      })
      await koaRequest
        .get('/teams/stats/' + e1.id)
        .expect(200)
        .then(response => {
          response.body[0].distance.should.equal(r1.distance + r2.distance)
          response.body[0].commitment.should.equal(0)
        })
    })
    it('should return only participant distance recorded during event challenge period', async () => {
      let e1 = await createEvent('e1')
      let t1 = await models.db.team.create({name: 't1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      let s1 = await models.db.source.create({name: 's1'})
      await models.db.record.create({
        date: '2017-01-01T00:00:00Z',
        distance: 10,
        participant_id: p1.id,
        source_id: s1.id
      })
      let r2 = await models.db.record.create({
        date: '2017-02-01T00:00:00Z',
        distance: 20,
        participant_id: p1.id,
        source_id: s1.id
      })
      await koaRequest
        .get('/teams/stats/' + e1.id)
        .expect(200)
        .then(response => {
          response.body[0].distance.should.equal(r2.distance)
          response.body[0].commitment.should.equal(0)
        })
    })
    it('should return participant commitment for team with single participant', async () => {
      let e1 = await createEvent('e1')
      let t1 = await models.db.team.create({name: 't1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      let c1 = await models.db.participant_event.create({participant_id: p1.id, event_id: e1.id, commitment: 100000})
      await koaRequest
        .get('/teams/stats/' + e1.id)
        .expect(200)
        .then(response => {
          response.body[0].distance.should.equal(0)
          response.body[0].commitment.should.equal(c1.commitment)
        })
    })
    it('should return only participant commitment for specified event', async () => {
      let e1 = await createEvent('e1')
      let e2 = await createEvent('e2')
      let t1 = await models.db.team.create({name: 't1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      let c1 = await models.db.participant_event.create({participant_id: p1.id, event_id: e1.id, commitment: 100000})
      await models.db.participant_event.create({participant_id: p1.id, event_id: e2.id, commitment: 200000})
      await koaRequest
        .get('/teams/stats/' + e1.id)
        .expect(200)
        .then(response => {
          response.body[0].distance.should.equal(0)
          response.body[0].commitment.should.equal(c1.commitment)
        })
    })
    it('should return participant distance and commitment for team with multiple participants', async () => {
      let e1 = await createEvent('e1')
      let t1 = await models.db.team.create({name: 't1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      let p2 = await models.db.participant.create({fbid: 'p2', team_id: t1.id})
      let s1 = await models.db.source.create({name: 's1'})
      let r1 = await models.db.record.create({
        date: '2017-02-01T00:00:00Z',
        distance: 10,
        participant_id: p1.id,
        source_id: s1.id
      })
      let r2 = await models.db.record.create({
        date: '2017-02-02T00:00:00Z',
        distance: 20,
        participant_id: p2.id,
        source_id: s1.id
      })
      let c1 = await models.db.participant_event.create({participant_id: p1.id, event_id: e1.id, commitment: 10000})
      let c2 = await models.db.participant_event.create({participant_id: p2.id, event_id: e1.id, commitment: 20000})
      await koaRequest
        .get('/teams/stats/' + e1.id)
        .expect(200)
        .then(response => {
          response.body[0].distance.should.equal(r1.distance + r2.distance)
          response.body[0].commitment.should.equal(c1.commitment + c2.commitment)
        })
    })
    it('should return participant distance and commitment for multiple teams', async () => {
      let e1 = await createEvent('e1')
      let t1 = await models.db.team.create({name: 't1'})
      let t2 = await models.db.team.create({name: 't2'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      let p2 = await models.db.participant.create({fbid: 'p2', team_id: t1.id})
      let p3 = await models.db.participant.create({fbid: 'p3', team_id: t2.id})
      let p4 = await models.db.participant.create({fbid: 'p4', team_id: t2.id})
      let s1 = await models.db.source.create({name: 's1'})
      let r1 = await models.db.record.create({
        date: '2017-02-01T00:00:00Z',
        distance: 10,
        participant_id: p1.id,
        source_id: s1.id
      })
      let r2 = await models.db.record.create({
        date: '2017-02-01T00:00:00Z',
        distance: 20,
        participant_id: p2.id,
        source_id: s1.id
      })
      let r3 = await models.db.record.create({
        date: '2017-02-01T00:00:00Z',
        distance: 30,
        participant_id: p3.id,
        source_id: s1.id
      })
      let r4 = await models.db.record.create({
        date: '2017-02-01T00:00:00Z',
        distance: 40,
        participant_id: p4.id,
        source_id: s1.id
      })
      let c1 = await models.db.participant_event.create({participant_id: p1.id, event_id: e1.id, commitment: 10000})
      let c2 = await models.db.participant_event.create({participant_id: p2.id, event_id: e1.id, commitment: 20000})
      let c3 = await models.db.participant_event.create({participant_id: p3.id, event_id: e1.id, commitment: 30000})
      let c4 = await models.db.participant_event.create({participant_id: p4.id, event_id: e1.id, commitment: 40000})
      await koaRequest
        .get('/teams/stats/' + e1.id)
        .expect(200)
        .then(response => {
          response.body.should.have.lengthOf(2)
          response.body[0].id.should.equal(t1.id)
          response.body[0].distance.should.equal(r1.distance + r2.distance)
          response.body[0].commitment.should.equal(c1.commitment + c2.commitment)
          response.body[1].id.should.equal(t2.id)
          response.body[1].distance.should.equal(r3.distance + r4.distance)
          response.body[1].commitment.should.equal(c3.commitment + c4.commitment)
        })
    })
  })

  context('GET /teams/:id', () => {
    it('should return 204 if no team with id=id', async () => {
      await koaRequest
        .get('/teams/1')
        .expect(204)
    })
    it('should return team with id=id', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      await koaRequest
        .get('/teams/' + t1.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(t1.name)
          response.body.image.should.equal(t1.image)
          response.body.hidden.should.equal(false)
        })
    })
    it('should return team with id=id with participants', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      let p1 = await models.db.participant.create({fbid: 'p1', team_id: t1.id})
      await koaRequest
        .get('/teams/' + t1.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(t1.name)
          response.body.image.should.equal(t1.image)
          response.body.participants[0].fbid.should.equal(p1.fbid)
        })
    })
    it('should return team with id=id with achievements', async () => {
      let t1 = await models.db.team.create({name: 't1', image: 'i1'})
      let a1 = await models.db.achievement.create({sequence: 1, name: 'a1', distance: 1})
      await models.db.team_achievement.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .get('/teams/' + t1.id)
        .expect(200)
        .then(response => {
          response.body.name.should.equal(t1.name)
          response.body.image.should.equal(t1.image)
          response.body.achievements[0].sequence.should.equal(a1.sequence)
          response.body.achievements[0].name.should.equal(a1.name)
          response.body.achievements[0].distance.should.equal(a1.distance)
        })
    })
  })

  context('POST /teams', () => {
    it('should create team with name=name', async () => {
      let name = 't1'
      let p1 = await models.db.participant.create({fbid: 'p1'})
      await koaRequest
        .post('/teams')
        .send({name, creator_id: p1.fbid})
        .expect(201)
        .then(response => {
          response.body.name.should.equal(name)
          response.body.creator_id.should.equal(p1.fbid)
        })
    })
    it('should create team with name=name, image=image, and hidden=hidden', async () => {
      let name = 't1'
      let image = 'i1'
      let p1 = await models.db.participant.create({fbid: 'p1'})
      let hidden = true
      await koaRequest
        .post('/teams')
        .send({name, image, creator_id: p1.fbid, hidden})
        .expect(201)
        .then(response => {
          response.body.name.should.equal(name)
          response.body.image.should.equal(image)
          response.body.creator_id.should.equal(p1.fbid)
          response.body.hidden.should.equal(hidden)
        })
    })
    it('should return 409 if team name conflict', async () => {
      let t2 = await models.db.team.create({name: 't2'})
      await koaRequest
        .post('/teams')
        .send({name: t2.name})
        .expect(409, {'error': {
          'code': 409,
          'message': `team named "${t2.name}" already exists`
        }})
    })
    it('should return 400 if creator_id not specified', async () => {
      let name = 't1'
      let fbid = 'undefined'
      await koaRequest
        .post('/teams')
        .send({name})
        .expect(400, {'error': {
          'code': 400,
          'message': `participant with fbid "${fbid}" does not exist`
        }})
    })
    it('should return 400 if creator does not exist', async () => {
      let name = 't1'
      let fbid = 'p1'
      await koaRequest
        .post('/teams')
        .send({name, creator_id: fbid})
        .expect(400, {'error': {
          'code': 400,
          'message': `participant with fbid "${fbid}" does not exist`
        }})
    })
  })

  context('PATCH /teams/:id', () => {
    it('should change team name', async () => {
      let t1 = await models.db.team.create({name: 't1'})
      await koaRequest
        .patch('/teams/' + t1.id)
        .send({name: 't2'})
        .expect(200, [1])
    })
    it('should change team privacy', async () => {
      let t1 = await models.db.team.create({name: 't1', hidden: true})
      await koaRequest
        .patch('/teams/' + t1.id)
        .send({hidden: false})
        .expect(200, [1])
    })
    it('should return 400 if no team with id=id', async () => {
      await koaRequest
        .patch('/teams/' + 1)
        .send({name: 't2'})
        .expect(400, [0])
    })
    it('should return 400 if team name conflict', async () => {
      let t2 = await models.db.team.create({name: 't2'})
      let t3 = await models.db.team.create({name: 't3'})
      await koaRequest
        .patch('/teams/' + t2.id)
        .send({name: t3.name})
        .expect(400, {'error': {
          'code': 400,
          'message': 'Validation error'
        }})
    })
  })

  context('DELETE /teams/:id', () => {
    it('should delete team with id=id', async () => {
      let t1 = await models.db.team.create({name: 't1'})
      await koaRequest
        .del('/teams/' + t1.id)
        .expect(204)
    })
    it('should return 400 if no team with id=id', async () => {
      await koaRequest
        .del('/teams/' + 0)
        .expect(400)
    })
  })
})
