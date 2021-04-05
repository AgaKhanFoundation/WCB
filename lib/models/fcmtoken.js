module.exports = (sequelize, DataTypes) => {
  return sequelize.define('fcmtoken', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fcm_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  })
}
