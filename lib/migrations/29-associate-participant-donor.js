module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'participant_donor',
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
          'participant_donor',
          'donor_id',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'donor',
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
      'participant_donor',
      'participant_id'
    )
      .then(() => {
        return queryInterface.removeColumn(
          'participant_donor',
          'donor_id'
        )
      })
  }
}
