

module.exports = {
  up: async (queryInterface, Sequelize) => {  // eslint-disable-line
    await queryInterface.addColumn(
      'questions',
      'order',
      Sequelize.INTEGER
    );

  },

  down: (queryInterface, Sequelize) => {  // eslint-disable-line
    return queryInterface.removeColumn(
      'questions',
      'order'
    );
  },
};
