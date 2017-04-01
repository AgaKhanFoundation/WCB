module.exports = function (sequelize, DataTypes) {
  return sequelize.define('achivements', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    team: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'team',
        key: 'id'
      }
    },
    achievement: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'achievement',
        key: 'id'
      }
    }
  }, {
    tableName: 'achivements'
  })
}
