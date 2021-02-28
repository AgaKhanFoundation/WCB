module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('achievement', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      sequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      distance: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING
      },
      subtitle: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      media: {
        type: Sequelize.TEXT
      },
      icon_name: {
        type: Sequelize.STRING
      },
      map_image: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('achievement')
  }
}
