module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('achievement', 'sequence', {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true
        }, {transaction: t}),
        queryInterface.addColumn('achievement', 'title', Sequelize.STRING, {transaction: t}),
        queryInterface.addColumn('achievement', 'subtitle', Sequelize.STRING, {transaction: t}),
        queryInterface.addColumn('achievement', 'description', Sequelize.TEXT, {transaction: t}),
        queryInterface.addColumn('achievement', 'media', Sequelize.TEXT, {transaction: t})
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('achievement', 'sequence', {transaction: t}),
        queryInterface.removeColumn('achievement', 'title', {transaction: t}),
        queryInterface.removeColumn('achievement', 'subtitle', {transaction: t}),
        queryInterface.removeColumn('achievement', 'description', {transaction: t}),
        queryInterface.removeColumn('achievement', 'media', {transaction: t})
      ])
    })
  }
}
