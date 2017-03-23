/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('record', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    participant: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'participant',
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
        model: 'source',
        key: 'id'
      }
    }
  }, {
    tableName: 'record'
  })
}
