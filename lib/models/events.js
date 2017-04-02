module.exports = function (sequelize, DataTypes) {
  return sequelize.define('events', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    locality: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'locality',
        key: 'id'
      }
    },
    team_limit: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    team_building_start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    team_building_end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cause: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'causes',
        key: 'id'
      }
    }
  }, {
    tableName: 'events'
  })
}
