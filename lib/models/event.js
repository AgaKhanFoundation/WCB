module.exports = (sequelize, DataTypes) => {
  return sequelize.define('event', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    image: {
      type: DataTypes.STRING
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
    },
    default_steps: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
}
