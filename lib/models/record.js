module.exports = function (sequelize, DataTypes) {
  return sequelize.define('record', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    participant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'participant',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    source: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'source',
        key: 'id'
      }
    }
  }, {
    tableName: 'record'
  })
}
