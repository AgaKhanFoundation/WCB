module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'event',
      'default_steps',
      {
        type: Sequelize.INTEGER
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'event',
      'default_steps'
    )
  }
}
