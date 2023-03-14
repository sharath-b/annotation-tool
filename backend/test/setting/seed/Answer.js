const Base = require('./Base');
const { random, date } = require('faker');

class Answer extends Base {
  constructor(app) {
    super(app);
    this.model = app.model.Answer;
  }

  createRecord({ userId, documentId, questionId, answer_category }) {
    return {
      id: random.number(),
      document_id: documentId || random.number(),
      start_offset: 0,
      end_offset: 2,
      user_id: userId || random.number(),
      selected_text: random.words(5),
      question_id: questionId || random.number(),
      answer_category // || 'LONG' // see answerCategories.js
    };
  }
}

module.exports = Answer;
