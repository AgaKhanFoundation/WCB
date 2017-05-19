module.exports = function (sequelize, DataTypes) {
  return sequelize.define('participant', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fbid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'event',
        key: 'id'
      }
    },
    datasource: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'source',
        key: 'id'
      }
    },
    preferred_cause: {
      type: DataTypes.INTEGER,
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
