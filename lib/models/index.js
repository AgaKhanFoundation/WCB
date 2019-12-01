const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV
if (!env) { throw new Error('NODE_ENV is not set!') }
const config = require(path.resolve('./config/config.js'))[env]
config.define = {timestamps: false, underscored: true}
const sequelize = new Sequelize(config.database, config.username, config.password, config)
let db = {}
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach((file) => {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

async function dbHealthCheck () {
  try {
    await sequelize.query('select 1=1', {type: sequelize.QueryTypes.SELECT})
    return true
  } catch (err) {
    console.log('Connection failed: ' + err)
    throw err
  }
}

// Associations
db.team.hasMany(db.participant)
db.participant.belongsTo(db.team)
db.team.belongsTo(db.participant, {as: 'creator', targetKey: 'fbid', constraints: false})

db.team.belongsToMany(db.achievement, {through: 'team_achievement'})
db.achievement.belongsToMany(db.team, {through: 'team_achievement'})

db.participant.hasMany(db.record)
db.record.belongsTo(db.participant)

db.source.hasMany(db.record)
db.record.belongsTo(db.source)

db.source.hasMany(db.participant)
db.participant.belongsTo(db.source)

db.cause.hasMany(db.participant)
db.participant.belongsTo(db.cause)

db.event.belongsToMany(db.participant, {through: 'participant_event'})
db.participant.belongsToMany(db.event, {through: 'participant_event'})

db.fcmtoken.belongsTo(db.participant)

db.locality.hasMany(db.event)
db.event.belongsTo(db.locality)

db.cause.hasMany(db.event)
db.event.belongsTo(db.cause)

db.participant.belongsToMany(db.sponsor, {through: 'participant_sponsor'})
db.sponsor.belongsToMany(db.participant, {through: 'participant_sponsor'})

db.participant.belongsToMany(db.donor, {through: 'participant_donor'})
db.donor.belongsToMany(db.participant, {through: 'participant_donor'})

sequelize.sync()
db.sequelize = sequelize

module.exports = {db, dbHealthCheck}
