/* eslint-env mocha */

const koaRequest = require('./routes-specs').koaRequest
const models = require('./routes-specs').models

beforeEach(function syncDB () {
  return models.db.sequelize.sync({force: true})
})

describe('achievement', () => {
  context('GET /achievement', () => {
    it('should return achievements', async () => {
      let a1 = await models.db.achievement.create({
        sequence: 1,
        name: 'London',
        distance: 100,
        description: 'AKF United Kingdom',
        icon_name: 'greatbritain',
        map_image: 'challenge1_0.png',
        title: 'Article1',
        subtitle: 'Author1',
        content: '<p>Aga Khan University became the leading healthcare institution in Pakistan and influences healthcare practice and policy across the country. AKU Hospital will continue to develop skills of healthcare professionals like Zainab to deliver world-class care.</p><br><br>Read the full story here:<br><a href="https://www.akfusa.org/our-stories/reaching-new-heights-in-national-healthcare/" target="_blank">https://www.akfusa.org/our-stories/reaching-new-heights-in-national-healthcare/</a>',
        media: 'photo:photo1_url video:video1_url'
      })
      let a2 = await models.db.achievement.create({
        sequence: 2,
        name: 'Paris',
        distance: 200,
        description: 'AKF Kenya',
        icon_name: 'france',
        map_image: 'challenge1_1.png',
        title: 'Article2',
        subtitle: 'Author2',
        content: '<p>A Grade 9 student at Joy Primary School in Mathare admits "I was not good at reading,".</p><p>That changed by Start-A-Library campaign supported by the Aga Khan Foundation and the Yetu Initiative.</p><br>Read full story here:<br><a href="https://www.akfusa.org/our-stories/primary-secondary-stretching-their-wings/" target="_blank">https://www.akfusa.org/our-stories/primary-secondary-stretching-their-wings/</a>.',
        media: 'photo:photo2_url video:video2_url'
      })
      await koaRequest
        .get('/achievement')
        .expect(200)
        .then(response => {
          response.body[0].sequence.should.equal(a1.sequence)
          response.body[0].name.should.equal(a1.name)
          response.body[0].distance.should.equal(a1.distance)
          response.body[0].description.should.equal(a1.description)
          response.body[0].icon_name.should.equal(a1.icon_name)
          response.body[0].map_image.should.equal(a1.map_image)
          response.body[0].title.should.equal(a1.title)
          response.body[0].subtitle.should.equal(a1.subtitle)
          response.body[0].content.should.equal(a1.content)
          response.body[0].media.should.equal(a1.media)
          response.body[1].sequence.should.equal(a2.sequence)
          response.body[1].name.should.equal(a2.name)
          response.body[1].distance.should.equal(a2.distance)
          response.body[1].description.should.equal(a2.description)
          response.body[1].icon_name.should.equal(a2.icon_name)
          response.body[1].map_image.should.equal(a2.map_image)
          response.body[1].title.should.equal(a2.title)
          response.body[1].subtitle.should.equal(a2.subtitle)
          response.body[1].content.should.equal(a2.content)
          response.body[1].media.should.equal(a2.media)
        })
    })
    it('should return achievements with teams', async () => {
      let a1 = await models.db.achievement.create({sequence: 1, name: 'a1', distance: 1})
      let t1 = await models.db.team.create({name: 't1'})
      await models.db.team_achievement.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .get('/achievement')
        .expect(200)
        .then(response => {
          response.body[0].sequence.should.equal(a1.sequence)
          response.body[0].name.should.equal(a1.name)
          response.body[0].distance.should.equal(a1.distance)
          response.body[0].teams[0].name.should.equal(t1.name)
        })
    })
  })

  context('GET /achievement/:id', () => {
    it('should return 204 if no achievement with id=id', async () => {
      await koaRequest
        .get('/achievement/1')
        .expect(204)
    })
    it('should return achievement with id=id', async () => {
      let achievement = await models.db.achievement.create({
        sequence: 1,
        name: 'London',
        distance: 100
      })
      await koaRequest
        .get('/achievement/' + achievement.id)
        .expect(200)
        .then(response => {
          response.body.sequence.should.equal(achievement.sequence)
          response.body.name.should.equal(achievement.name)
          response.body.distance.should.equal(achievement.distance)
        })
    })
    it('should return achievement with id=id with teams', async () => {
      let a1 = await models.db.achievement.create({sequence: 1, name: 'a1', distance: 1})
      let t1 = await models.db.team.create({name: 't1'})
      await models.db.team_achievement.create({team_id: t1.id, achievement_id: a1.id})
      await koaRequest
        .get('/achievement/' + a1.id)
        .expect(200)
        .then(response => {
          response.body.sequence.should.equal(a1.sequence)
          response.body.name.should.equal(a1.name)
          response.body.distance.should.equal(a1.distance)
          response.body.teams[0].name.should.equal(t1.name)
        })
    })
  })

  context('POST /achievement', () => {
    it('should create achievement with sequence=sequence, name=name, distance=distance,' +
      'description=description, icon_name=icon_name, map_image=map_image,' +
      'title=title, subtitle=subtitle, content=subtitle, and media=media', async () => {
      let sequence = 1
      let name = 'London'
      let distance = 100
      let description = ''
      let iconName = 'pakistan'
      let mapImage = 'test.png'
      let title = 'title'
      let subtitle = 'subtitle'
      let content = 'content with html tags'
      let media = 'photo:photo_1.png video:video_1.png'
      await koaRequest
        .post('/achievement')
        .send({
          sequence,
          name,
          distance,
          description,
          icon_name: iconName,
          map_image: mapImage,
          title,
          subtitle,
          content,
          media
        })
        .expect(201)
        .then(response => {
          response.body.sequence.should.equal(sequence)
          response.body.name.should.equal(name)
          response.body.distance.should.equal(distance)
          response.body.description.should.equal(description)
          response.body.icon_name.should.equal(iconName)
          response.body.map_image.should.equal(mapImage)
          response.body.title.should.equal(title)
          response.body.subtitle.should.equal(subtitle)
          response.body.content.should.equal(content)
          response.body.media.should.equal(media)
        })
    })
    it('should return 409 if achievement name conflict', async () => {
      let a2 = await models.db.achievement.create({
        sequence: 1,
        name: 'London',
        distance: 100,
        description: 'AKF UK',
        icon_name: 'greatbritain',
        map_image: 'challenge1_0.png',
        title: 'Article1',
        subtitle: 'Author1',
        content: 'content1 with html tags',
        media: 'photo:photo1_url video:video1_url'
      })
      await koaRequest
        .post('/achievement')
        .send({
          sequence: 0,
          name: a2.name,
          distance: a2.distance,
          description: a2.description,
          icon_name: a2.flag_ame,
          map_image: a2.map_image,
          title: a2.title,
          subtitle: a2.subtitle,
          content: a2.content,
          media: a2.media
        })
        .expect(409, {'error': {
          'code': 409,
          'message': `achievement with sequence="0" or named "${a2.name}" already exists`
        }})
    })
    it('should return 409 if achievement sequence conflict', async () => {
      let a2 = await models.db.achievement.create({sequence: 1, name: 'Paris', distance: 100})
      await koaRequest
        .post('/achievement')
        .send({
          sequence: a2.sequence,
          name: 'London',
          distance: a2.distance,
          description: a2.description,
          icon_name: a2.flag_ame,
          map_image: a2.map_image,
          title: a2.title,
          subtitle: a2.subtitle,
          content: a2.content,
          media: a2.media
        })
        .expect(409, {'error': {
          'code': 409,
          'message': `achievement with sequence="${a2.sequence}" or named "London" already exists`
        }})
    })
  })

  context('PATCH /achievement/:id', () => {
    it('should change achievement sequence, name, distance, description, ' +
       'icon_name, map_image, title, subtitle, content, and media', async () => {
      let achievement = await models.db.achievement.create({
        sequence: 1,
        name: 'London',
        distance: 100,
        description: 'AKF UK',
        icon_name: 'greatbritain',
        map_image: 'challenge1_0.png',
        title: 'Article1',
        subtitle: 'Author1',
        content: 'content1 with html tags',
        media: 'photo:photo1_url video:video1_url'})
      await koaRequest
        .patch('/achievement/' + achievement.id)
        .send({
          sequence: 2,
          name: 'Paris',
          distance: 200,
          description: 'AKF Paris',
          icon_name: 'france',
          map_image: 'challenge1_1.png',
          title: 'Article2',
          subtitle: 'Author2',
          content: 'content2 with html tags',
          media: 'photo:photo2_url video:video2_url'
        })
        .expect(200, [1])
    })
    it('should return 400 if no achievement with id=id', async () => {
      await koaRequest
        .patch('/achievement/' + 1)
        .send({name: 'a2'})
        .expect(400, [0])
    })
    it('should return 400 if achievement name conflict', async () => {
      let a2 = await models.db.achievement.create({sequence: 1, name: 'Paris', distance: 200})
      let a3 = await models.db.achievement.create({sequence: 2, name: 'Amsterdam', distance: 300})
      await koaRequest
        .patch('/achievement/' + a2.id)
        .send({name: a3.name})
        .expect(400, {'error': {
          'code': 400,
          'message': `Validation error`
        }})
    })
    it('should return 400 if achievement sequence conflict', async () => {
      let a2 = await models.db.achievement.create({sequence: 1, name: 'Paris', distance: 200})
      let a3 = await models.db.achievement.create({sequence: 2, name: 'Amsterdam', distance: 300})
      await koaRequest
        .patch('/achievement/' + a2.id)
        .send({sequence: a3.sequence})
        .expect(400, {'error': {
          'code': 400,
          'message': `Validation error`
        }})
    })
  })

  context('DELETE /achievement/:id', () => {
    it('should delete achievement with id=id', async () => {
      let achievement = await models.db.achievement.create({sequence: 1, name: 'London', distance: 100})
      await koaRequest
        .del('/achievement/' + achievement.id)
        .expect(204)
    })
    it('should return 400 if no achievement with id=id', async () => {
      await koaRequest
        .del('/achievement/' + 0)
        .expect(400)
    })
  })
})
