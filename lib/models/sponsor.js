module.exports = (sequelize, DataTypes) => {
  return sequelize.define('sponsor', {
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
    luminate_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  })
}
