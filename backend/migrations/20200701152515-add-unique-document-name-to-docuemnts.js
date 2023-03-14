

module.exports = {
  up: async (queryInterface, Sequelize) => {  // eslint-disable-line
    await queryInterface.addColumn(
      'documents',
      'unique_document_name',
      Sequelize.STRING
    );

  },

  down: (queryInterface, Sequelize) => {  // eslint-disable-line
    return queryInterface.removeColumn(
      'documents',
      'unique_document_name'
    );
  },
};
