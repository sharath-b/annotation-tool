

module.exports = {
  up: async (queryInterface, Sequelize) => {  // eslint-disable-line
    await queryInterface.addColumn(
      'questions',
      'external_identifier',
      Sequelize.STRING
    );

  },

  down: (queryInterface, Sequelize) => {  // eslint-disable-line
    return queryInterface.removeColumn(
      'questions',
      'external_identifier'
    );
  },
};
