module.exports = function (sequelize, DataTypes) {
  return sequelize.define('participant', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    fbid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    team: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'team',
        key: 'id'
      }
    }
  }, {
    tableName: 'participant'
  })
}
