

module.exports = {
  up: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.createTable('documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      text: {
        type: Sequelize.TEXT,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'projects',
          },
          key: 'id',
        },
      },
      status: {
        type: Sequelize.STRING,
        default: 'open',
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

  down: queryInterface => {
    return queryInterface.dropTable('documents');
  },
};
