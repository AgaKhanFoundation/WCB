module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'participant',
      'registered',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'participant',
      'registered'
    )
  }
}
