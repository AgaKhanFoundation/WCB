module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('participant_notification', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      read_flag: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('participant_notification')
  }
}
