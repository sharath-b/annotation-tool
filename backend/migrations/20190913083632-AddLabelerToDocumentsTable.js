

module.exports = {
  up: (queryInterface, Sequelize) => {  // eslint-disable-line
    return queryInterface.addColumn(
      'documents',
      'labeler_id',
      Sequelize.INTEGER
    );
  },

  down: (queryInterface, Sequelize) => {  // eslint-disable-line
    return queryInterface.removeColumn(
      'documents',
      'labeler_id'
    );
  },
};
