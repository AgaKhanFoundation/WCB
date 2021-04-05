const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV
if (!env) { throw new Error('NODE_ENV is not set!') }
const config = require(path.resolve('./config/config.js'))[env]
config.define = {timestamps: false, underscored: true, freezeTableName: true}
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

db.team.belongsToMany(db.achievement, {through: db.team_achievement})
db.achievement.belongsToMany(db.team, {through: db.team_achievement})

db.participant.hasMany(db.record)
db.record.belongsTo(db.participant)

db.source.hasMany(db.record)
db.record.belongsTo(db.source)

db.source.hasMany(db.participant)
db.participant.belongsTo(db.source)

db.cause.hasMany(db.participant)
db.participant.belongsTo(db.cause)

db.event.belongsToMany(db.participant, {through: db.participant_event})
db.participant.belongsToMany(db.event, {through: db.participant_event})

db.participant.hasMany(db.fcmtoken)
db.fcmtoken.belongsTo(db.participant)

db.locality.hasMany(db.event)
db.event.belongsTo(db.locality)

db.cause.hasMany(db.event)
db.event.belongsTo(db.cause)

db.participant.belongsToMany(db.sponsor, {through: db.participant_sponsor})
db.sponsor.belongsToMany(db.participant, {through: db.participant_sponsor})

db.participant.belongsToMany(db.donor, {through: db.participant_donor})
db.donor.belongsToMany(db.participant, {through: db.participant_donor})

db.participant.belongsToMany(db.notification, {through: db.participant_notification})
db.notification.belongsToMany(db.participant, {through: db.participant_notification})

sequelize.sync()
db.sequelize = sequelize

module.exports = {db, dbHealthCheck}
