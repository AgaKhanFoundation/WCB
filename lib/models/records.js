module.exports = function (sequelize, DataTypes) {
  return sequelize.define('records', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    participant: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'participants',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    distance: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    source: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'sources',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'records'
  })
}
