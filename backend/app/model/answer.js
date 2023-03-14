

module.exports = app => {
  const { TEXT, INTEGER, DATE, STRING } = app.Sequelize;

  const Answer = app.model.define('answer', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER,
    },
    document_id: INTEGER,
    start_offset: INTEGER,
    end_offset: INTEGER,
    user_id: INTEGER,
    answer_category: STRING, // see answerCategories.js
    selected_text: TEXT,
    question_id: INTEGER,
    created_at: DATE,
    updated_at: DATE,
  }, { underscored: true });

  return Answer;
};

