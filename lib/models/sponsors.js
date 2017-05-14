module.exports = function (sequelize, DataTypes) {
  return sequelize.define('sponsors', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sponsor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sponsor',
        key: 'id'
      }
    },
    participant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'participant',
        key: 'id'
      }
    }
  }, {
    tableName: 'sponsors'
  })
}
