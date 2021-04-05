module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'event',
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
      'event',
      'cause_id'
    )
  }
}
