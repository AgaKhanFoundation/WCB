module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'participant',
      'event_id'
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'participant',
      'event_id',
      Sequelize.INTEGER
    )
  }
}
