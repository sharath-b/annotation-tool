const Service = require('./baseService');

class AnswerService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Answer;
  }

  async findByDocument(document_id) {
    return this.model.findAll({ where: { document_id } });
  }

  async findByDocumentAndLabler(document_id, user_id) {
    return this.model.findAll({ where: { document_id, user_id } });
  }

  async getAnswersToExport() {
    const query = `SELECT answers.id,
                          questions.text as question,
                          answers.selected_text,
                          answers.document_id,
                          answers.answer_category,
                          question_id,
                          user_id,
                          start_offset,
                          end_offset
                   FROM answers
                          JOIN questions ON question_id = questions.id`;
    const sequelize = this.model.sequelize;
    const result = await sequelize.query(query, {
      type: sequelize.QueryTypes.RAW,
    });
    return result[0];
  }

  async getAnswers(project_id) {
    const query = `SELECT answers.id,
                          questions.text as question,
                          answers.selected_text,
                          answers.document_id,
                          question_id,
                          answers.answer_category,
                          answers.user_id,
                          start_offset,
                          end_offset
                   FROM answers
                          JOIN questions ON question_id = questions.id
                          JOIN documents ON documents.id = answers.document_id
                   WHERE documents.project_id = ${project_id} AND documents.id = answers.document_id
    `;

    const sequelize = this.model.sequelize;
    const result = await sequelize.query(query, {
      type: sequelize.QueryTypes.RAW,
    });

    return result[0];
  }
}

module.exports = AnswerService;
