module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sponsor', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      luminate_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sponsor')
  }
}
