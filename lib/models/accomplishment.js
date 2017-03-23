/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('accomplishment', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    team: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'team',
        key: 'id'
      }
    },
    destination: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'destinations',
        key: 'id'
      }
    }
  }, {
    tableName: 'accomplishment'
  })
}
