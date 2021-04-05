module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'fcmtoken',
      'participant_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'participant',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'fcmtoken',
      'participant_id'
    )
  }
}
