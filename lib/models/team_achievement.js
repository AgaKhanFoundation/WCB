module.exports = function (sequelize, DataTypes) {
  return sequelize.define('team_achievement', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'team_achievement'
  })
}
