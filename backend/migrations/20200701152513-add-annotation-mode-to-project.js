module.exports = {
  up: async (queryInterface, Sequelize) => {
    // eslint-disable-line
    await queryInterface.addColumn('projects', 'annotation_mode', {
      type: Sequelize.STRING,
      defaultValue: 'DEFAULT',
    });
  },

  down: queryInterface => {
    // eslint-disable-line
    return queryInterface.removeColumn('projects', 'annotation_mode');
  },
};
