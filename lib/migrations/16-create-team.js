module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('team', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      image: {
        type: Sequelize.STRING
      },
      hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('team')
  }
}
