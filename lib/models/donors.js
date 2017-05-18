module.exports = function (sequelize, DataTypes) {
  return sequelize.define('donors', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'donors'
  })
}
