module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'team',
      'image',
      Sequelize.STRING
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'team',
      'image'
    )
  }
}
