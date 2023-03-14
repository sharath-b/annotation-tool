const Base = require('./Base');
const { random, date } = require('faker');

class Question extends Base {
  constructor(app) {
    super(app);
    this.model = app.model.Question;
  }

  createRecord({ documentId, projectId }) {
    return {
      id: random.number(),
      text: random.words(5),
      category: 'A',
      document_id: documentId || random.number(),
      order: random.number(),
      project_id: projectId || random.number(),
    };
  }
}

module.exports = Question;
