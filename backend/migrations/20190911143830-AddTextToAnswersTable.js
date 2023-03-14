

module.exports = {
  up: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.addColumn(
      'answers',
      'selected_text',
      Sequelize.TEXT
    );
  },

  down: (queryInterface, Sequelize) => { // eslint-disable-line
    return queryInterface.removeColumn(
      'answers',
      'selected_text'
    );
  },
};
