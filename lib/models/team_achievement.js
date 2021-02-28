module.exports = (sequelize, DataTypes) => {
  return sequelize.define('team_achievement', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  })
}
