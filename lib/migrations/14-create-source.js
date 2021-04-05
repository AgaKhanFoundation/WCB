module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('source', {
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
    return queryInterface.dropTable('source')
  }
}
