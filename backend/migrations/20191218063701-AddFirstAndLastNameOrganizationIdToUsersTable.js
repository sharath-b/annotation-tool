

module.exports = {
  up: async (queryInterface, Sequelize) => {  // eslint-disable-line
    await queryInterface.addColumn(
      'users',
      'first_name',
      Sequelize.STRING
    );

    await queryInterface.addColumn(
      'users',
      'last_name',
      Sequelize.STRING
    );

    await queryInterface.addColumn(
      'users',
      'organization_id',
      Sequelize.INTEGER
    );
  },

  down: async queryInterface => {
    return [
      await queryInterface.removeColumn('users', 'first_name'),
      await queryInterface.removeColumn('users', 'last_name'),
      await queryInterface.removeColumn('users', 'organization_id'),
    ];
  },
};
