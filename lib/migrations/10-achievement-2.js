module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('achievement', 'flag_name', Sequelize.STRING, {transaction: t}),
        queryInterface.addColumn('achievement', 'map_image', Sequelize.STRING, {transaction: t}),
        queryInterface.addColumn('achievement', 'content', Sequelize.TEXT, {transaction: t})
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('achievement', 'flag_name', {transaction: t}),
        queryInterface.removeColumn('achievement', 'map_image', {transaction: t}),
        queryInterface.removeColumn('achievement', 'content', {transaction: t})
      ])
    })
  }
}
