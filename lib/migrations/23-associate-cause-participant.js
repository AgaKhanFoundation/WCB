module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'participant',
      'cause_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'cause',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'participant',
      'cause_id'
    )
  }
}
