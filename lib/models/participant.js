module.exports = (sequelize, DataTypes) => {
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
    registered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  })
}
