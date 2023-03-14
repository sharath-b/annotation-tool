module.exports = app => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  const Project = app.model.define('project', {
    name: STRING,
    organization_id: INTEGER,
    annotation_mode: STRING, //  DEFAULT | ANSWER_CATEGORY_MODE
    created_at: DATE,
    updated_at: DATE,
  }, { underscored: true });

  Project.associate = () => {
    app.model.Project.hasMany(app.model.Document, {
      onDelete: 'cascade',
      hooks: true,
    });

    app.model.Project.hasMany(app.model.Question, {
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return Project;
};
