module.exports = function (sequelize, DataTypes) {
  return sequelize.define('achievement', {
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
    distance: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'achievement'
  })
}
