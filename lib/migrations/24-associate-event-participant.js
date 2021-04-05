module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'participant_event',
      'participant_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'participant',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    )
      .then(() => {
        return queryInterface.addColumn(
          'participant_event',
          'event_id',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'event',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          }
        )
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'participant_event',
      'participant_id'
    )
      .then(() => {
        return queryInterface.removeColumn(
          'participant_event',
          'event_id'
        )
      })
  }
}
