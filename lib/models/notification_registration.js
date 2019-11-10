module.exports = function (sequelize, DataTypes) {
  return sequelize.define('notification_registration', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fbid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fcmToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    }
  }, {
    tableName: 'notification_registration'
  })
}
