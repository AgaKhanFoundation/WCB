module.exports = function (sequelize, DataTypes) {
  return sequelize.define('fitbit', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fitbit_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    participant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'participant',
        key: 'id'
      }
    }
  }, {
    tableName: 'fitbit'
  })
}
