module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'team',
      'creator_id',
      {
        type: Sequelize.INTEGER
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'team',
      'creator_id'
    )
  }
}
