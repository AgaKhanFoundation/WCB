module.exports = function (sequelize, DataTypes) {
  return sequelize.define('sponsors', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sponsor: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'sponsor',
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
    tableName: 'sponsors'
  })
}
