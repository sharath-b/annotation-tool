module.exports = {
  up: (queryInterface, Sequelize) => {  // eslint-disable-line
    return queryInterface.createTable('organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: queryInterface => {  // eslint-disable-line
    return queryInterface.dropTable('organizations');
  },
};
