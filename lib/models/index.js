const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
if (!process.env.NODE_ENV) { throw new Error('NODE_ENV is not set!') }
const dbSetting = require(path.resolve(`./settings/${process.env.NODE_ENV}.json`))
dbSetting.define = {timestamps: false, underscored: true}
const sequelize = new Sequelize(dbSetting.db, process.env.username, process.env.password, dbSetting)
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
db.team.hasMany(db.participant, {foreignKey: 'team'})
db.team.belongsToMany(db.achievement, {through: 'achievements', foreignKey: 'team'})
db.achievement.belongsToMany(db.team, {through: 'achievements', foreignKey: 'achievement'})

sequelize.sync({logging: console.log})
db.sequelize = sequelize

module.exports = {db, dbHealthCheck}
