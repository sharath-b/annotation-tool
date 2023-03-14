

module.exports = {
  up: async (queryInterface, Sequelize) => {  // eslint-disable-line
    await queryInterface.sequelize.query('UPDATE questions SET project_id = (SELECT project_id FROM documents WHERE documents.id = questions.document_id) WHERE questions.project_id IS NULL;');

  },

  down: (queryInterface, Sequelize) => {  // eslint-disable-line
  },
};
