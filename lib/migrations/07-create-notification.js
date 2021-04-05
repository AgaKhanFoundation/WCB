module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notification', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
      },
      message_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 10
        }
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    }, {
      indexes: [
        {
          unique: true,
          fields: ['event_id', 'message_date', 'message']
        }
      ]
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('notification')
  }
}
