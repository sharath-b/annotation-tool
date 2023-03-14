const crypto = require('crypto');

module.exports = app => {
  const { STRING, TEXT, INTEGER, DATE } = app.Sequelize;

  const Document = app.model.define('document', {
    text: TEXT,
    unique_document_name: STRING,
    status: { type: STRING, defaultValue: 'new' },
    hash: STRING,
    project_id: INTEGER,
    order: INTEGER,
    user_id: INTEGER,
    created_at: DATE,
    updated_at: DATE,
    file_name: STRING,
  }, { underscored: true });

  Document.associate = () => {
    app.model.Document.hasMany(app.model.Answer, {
      onDelete: 'cascade',
      hooks: true,
    });

    app.model.Document.hasMany(app.model.Question, {
      onDelete: 'cascade',
      hooks: true,
    });
  };

  Document.beforeValidate(doc => {
    if (doc.text) {
      doc.hash = crypto.createHash('md5').update(doc.text + doc.project_id).digest('hex');
    }
  });

  return Document;
};

