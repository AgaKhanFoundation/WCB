module.exports = function (sequelize, DataTypes) {
  return sequelize.define('donors', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    donor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'donor',
        key: 'id'
      }
    },
    participant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'participant',
        key: 'id'
      }
    }
  }, {
    tableName: 'donors'
  })
}
