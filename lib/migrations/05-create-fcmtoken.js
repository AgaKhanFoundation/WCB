module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fcmtoken', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      fcm_token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fcmtoken')
  }
}
