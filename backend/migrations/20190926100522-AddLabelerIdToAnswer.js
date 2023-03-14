

module.exports = {
  up: async (queryInterface, Sequelize) => {  // eslint-disable-line
    await queryInterface.addColumn(
      'answers',
      'labeler_id',
      Sequelize.INTEGER
    );

  },

  down: (queryInterface, Sequelize) => {  // eslint-disable-line
    return queryInterface.removeColumn(
      'answers',
      'labeler_id'
    );
  },
};
