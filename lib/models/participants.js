module.exports = function (sequelize, DataTypes) {
  return sequelize.define('participants', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fbid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    team: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'team',
        key: 'id'
      }
    },
    event: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    datasource: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'sources',
        key: 'id'
      }
    }
  }, {
    tableName: 'participants'
  })
}
