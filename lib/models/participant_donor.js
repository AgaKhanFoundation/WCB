module.exports = function (sequelize, DataTypes) {
  return sequelize.define('participant_donor', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'participant_donor'
  })
}
