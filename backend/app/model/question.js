

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Question = app.model.define('question', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER,
    },
    text: STRING,
    category: STRING,
    document_id: INTEGER,
    external_identifier: STRING,
    order: INTEGER,
    project_id: INTEGER,
    created_at: DATE,
    updated_at: DATE,
  }, { underscored: true });

  Question.associate = () => {
    app.model.Question.hasMany(app.model.Answer, {
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return Question;
};

