module.exports = function (sequelize, DataTypes) {
  return sequelize.define('sponsors', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'sponsors'
  })
}
