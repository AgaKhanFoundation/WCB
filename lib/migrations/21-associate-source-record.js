module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'record',
      'source_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'source',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'record',
      'source_id'
    )
  }
}
