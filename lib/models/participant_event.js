module.exports = (sequelize, DataTypes) => {
  return sequelize.define('participant_event', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    commitment: {
      type: DataTypes.INTEGER
    }
  })
}
