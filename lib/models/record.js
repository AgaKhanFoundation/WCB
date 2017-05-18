module.exports = function (sequelize, DataTypes) {
  return sequelize.define('record', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'record'
  })
}
