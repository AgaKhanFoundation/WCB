module.exports = function (sequelize, DataTypes) {
  return sequelize.define('achievements', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'achievements'
  })
}
