/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('sponsorship', {
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
    sponsor: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'sponsor',
        key: 'id'
      }
    },
    donation: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'sponsorship'
  })
}
