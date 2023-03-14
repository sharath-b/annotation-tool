

module.exports = {
  up: async (queryInterface, Sequelize) => {  // eslint-disable-line
    await queryInterface.addColumn(
      'documents',
      'file_name',
      Sequelize.STRING
    );

  },

  down: (queryInterface, Sequelize) => {  // eslint-disable-line
    return queryInterface.removeColumn(
      'documents',
      'file_name'
    );
  },
};
