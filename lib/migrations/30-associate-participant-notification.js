module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'participant_notification',
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
          'participant_notification',
          'notification_id',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'notification',
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
      'participant_notification',
      'participant_id'
    )
      .then(() => {
        return queryInterface.removeColumn(
          'participant_notification',
          'notification_id'
        )
      })
  }
}
