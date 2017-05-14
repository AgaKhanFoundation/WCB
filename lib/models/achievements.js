module.exports = function (sequelize, DataTypes) {
  return sequelize.define('achievements', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    team: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'achievementsIndex',
      references: {
        model: 'team',
        key: 'id'
      }
    },
    achievement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'achievementsIndex',
      references: {
        model: 'achievement',
        key: 'id'
      }
    }
  }, {
    tableName: 'achievements'
  })
}
