

module.exports = {
  up: async (queryInterface, Sequelize) => {  // eslint-disable-line
    await queryInterface.addColumn(
      'documents',
      'hash',
      Sequelize.STRING
    );
    return queryInterface.addIndex(
      'documents',
      [ 'hash' ],
      {
        indexName: 'unique_document_index',
        indicesType: 'UNIQUE',
        unique: true,
      });
  },
  down: (queryInterface, Sequelize) => {  // eslint-disable-line
    return queryInterface.removeColumn(
      'documents',
      'hash'
    );
  },
};
