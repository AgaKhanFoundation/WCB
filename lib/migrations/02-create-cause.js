module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cause', {
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
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cause')
  }
}
