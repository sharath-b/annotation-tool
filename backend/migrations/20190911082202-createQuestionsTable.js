module.exports = {
  up: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.createTable('questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      text: {
        type: Sequelize.STRING,
      },
      document_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'documents',
          },
          key: 'id',
        },
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

  down: (queryInterface, Sequelize) => {  // eslint-disable-line
    return queryInterface.dropTable('questions');
  },
};
