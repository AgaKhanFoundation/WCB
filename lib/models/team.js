module.exports = function (sequelize, DataTypes) {
  return sequelize.define('team', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    image_url: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'team'
  })
}
