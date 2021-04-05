module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('participant', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      fbid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      registered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('participant')
  }
}
