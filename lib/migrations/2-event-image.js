module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'event',
      'image_url',
      Sequelize.STRING
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'event',
      'image_url'
    )
  }
}
