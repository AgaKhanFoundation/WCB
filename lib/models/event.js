module.exports = function (sequelize, DataTypes) {
  return sequelize.define('event', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
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
    team_limit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    team_building_start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    team_building_end: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'event'
  })
}