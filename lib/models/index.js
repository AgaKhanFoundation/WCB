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

sequelize.sync({logging: console.log})
db.sequelize = sequelize

module.exports = {db, dbHealthCheck}
