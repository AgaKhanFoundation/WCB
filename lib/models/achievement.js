module.exports = function (sequelize, DataTypes) {
  return sequelize.define('achievement', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    distance: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'achievement'
  })
}
