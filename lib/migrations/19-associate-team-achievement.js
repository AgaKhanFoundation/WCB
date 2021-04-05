module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'team_achievement',
      'team_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'team',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    )
      .then(() => {
        return queryInterface.addColumn(
          'team_achievement',
          'achievement_id',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'achievement',
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
      'team_achievement',
      'team_id'
    )
      .then(() => {
        return queryInterface.removeColumn(
          'team_achievement',
          'achievement_id'
        )
      })
  }
}
