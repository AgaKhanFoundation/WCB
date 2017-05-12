module.exports = function (sequelize, DataTypes) {
  return sequelize.define('participant', {
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
      allowNull: true,
      references: {
        model: 'team',
        key: 'id'
      }
    },
    event_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    datasource: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'source',
        key: 'id'
      }
    },
    preferred_cause: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'cause',
        key: 'id'
      }
    }
  }, {
    tableName: 'participant'
  })
}
