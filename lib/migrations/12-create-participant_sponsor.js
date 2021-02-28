module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('participant_sponsor', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('participant_sponsor')
  }
}
