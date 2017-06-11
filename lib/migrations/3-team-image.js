module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'team',
      'image_url',
      Sequelize.STRING
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'team',
      'image_url'
    )
  }
}
