module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'team',
      'hidden',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'team',
      'hidden'
    )
  }
}
