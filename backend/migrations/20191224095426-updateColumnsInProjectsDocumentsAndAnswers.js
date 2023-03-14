module.exports = {
  up: async (queryInterface, Sequelize) => {  // eslint-disable-line
    // Projects
    await queryInterface.addColumn(
      'projects',
      'name',
      Sequelize.STRING
    );

    await queryInterface.addColumn(
      'projects',
      'organization_id',
      Sequelize.INTEGER
    );

    await queryInterface.removeColumn('projects', 'text');
    await queryInterface.removeColumn('projects', 'document_id');
    await queryInterface.removeColumn('projects', 'project_id');

    // Documents
    await queryInterface.renameColumn('documents', 'labeler_id', 'user_id');

    // Answers
    await queryInterface.renameColumn('answers', 'labeler_id', 'user_id');
  },

  down: async (queryInterface, Sequelize) => {
    return [
      // Projects
      await queryInterface.removeColumn('projects', 'name'),
      await queryInterface.removeColumn('projects', 'organization_id'),
      await queryInterface.addColumn(
        'projects',
        'text',
        Sequelize.STRING
      ),
      await queryInterface.addColumn(
        'projects',
        'document_id',
        Sequelize.INTEGER
      ),
      await queryInterface.addColumn(
        'projects',
        'project_id',
        Sequelize.INTEGER
      ),

      // Documents
      await queryInterface.renameColumn('documents', 'user_id', 'labeler_id'),

      // Answers
      await queryInterface.renameColumn('answers', 'user_id', 'labeler_id'),
    ];
  },
};
