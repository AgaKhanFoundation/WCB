const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV
if (!env) { throw new Error('NODE_ENV is not set!') }
const config = require(path.resolve('./config/config.json'))[env]
config.define = {timestamps: false, underscored: true}
const sequelize = new Sequelize(config.database, process.env.username, process.env.password, config)
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
    await sequelize.query('select 1=1', { type: sequelize.QueryTypes.SELECT })
    return true
  } catch (err) {
    console.log('Connection failed: ' + err)
    throw err
  }
}

// Associations
db.team.hasMany(db.participant)
db.participant.belongsTo(db.team)

db.team.belongsToMany(db.achievement, {through: 'achievements'})
db.achievement.belongsToMany(db.team, {through: 'achievements'})

db.participant.hasMany(db.record)
db.record.belongsTo(db.participant)

db.source.hasMany(db.record)
db.record.belongsTo(db.source)

db.source.hasMany(db.participant)
db.participant.belongsTo(db.source)

db.cause.hasMany(db.participant)
db.participant.belongsTo(db.cause)

db.event.hasMany(db.participant)
db.participant.belongsTo(db.event)

db.locality.hasMany(db.event)
db.event.belongsTo(db.locality)

db.cause.hasMany(db.event)
db.event.belongsTo(db.cause)

db.participant.belongsToMany(db.sponsor, {through: 'sponsors'})
db.sponsor.belongsToMany(db.participant, {through: 'sponsors'})

db.participant.belongsToMany(db.donor, {through: 'donors'})
db.donor.belongsToMany(db.participant, {through: 'donors'})

sequelize.sync()
db.sequelize = sequelize

module.exports = {db, dbHealthCheck}
