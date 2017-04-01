module.exports = function (sequelize, DataTypes) {
  return sequelize.define('donors', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    donor: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'donor',
        key: 'id'
      }
    },
    participant: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'participants',
        key: 'id'
      }
    }
  }, {
    tableName: 'donors'
  })
}
