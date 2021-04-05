module.exports = (sequelize, DataTypes) => {
  return sequelize.define('participant_sponsor', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  })
}
