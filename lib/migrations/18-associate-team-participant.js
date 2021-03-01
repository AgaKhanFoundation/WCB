module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'participant',
      'team_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'team',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    )
      .then(() => {
        return queryInterface.addColumn(
          'team',
          'creator_id',
          {
            type: Sequelize.INTEGER
          }
        )
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'participant',
      'team_id'
    )
      .then(() => {
        return queryInterface.removeColumn(
          'team',
          'creator_id'
        )
      })
  }
}
