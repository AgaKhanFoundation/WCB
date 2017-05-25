module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'event',
      'image',
      Sequelize.STRING
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'event',
      'image'
    )
  }
}
