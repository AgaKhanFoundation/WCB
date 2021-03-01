module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'participant_sponsor',
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
          'participant_sponsor',
          'sponsor_id',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'sponsor',
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
      'participant_sponsor',
      'participant_id'
    )
      .then(() => {
        return queryInterface.removeColumn(
          'participant_sponsor',
          'sponsor_id'
        )
      })
  }
}
