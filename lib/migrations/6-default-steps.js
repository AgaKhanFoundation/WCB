module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'event',
      'default_steps',
      Sequelize.INTEGER
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'event',
      'default_steps'
    )
  }
}
