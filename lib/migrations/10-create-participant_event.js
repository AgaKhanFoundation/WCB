module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('participant_event', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      commitment: {
        type: Sequelize.INTEGER
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('participant_event')
  }
}
