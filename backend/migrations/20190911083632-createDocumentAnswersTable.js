

module.exports = {
  up: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.createTable('answers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      document_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'documents',
          },
          key: 'id',
        },
      },
      question_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'questions',
          },
          key: 'id',
        },
      },
      start_offset: {
        type: Sequelize.INTEGER,
      },
      end_offset: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('answers');
  },
};
