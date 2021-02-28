module.exports = (sequelize, DataTypes) => {
  return sequelize.define('participant_notification', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    read_flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })
}
