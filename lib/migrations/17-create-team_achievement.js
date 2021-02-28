module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('team_achievement', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('team_achievement')
  }
}
