const Service = require('./baseService');

const { parse } = require('fast-csv');

class QuestionService extends Service {
  constructor(ctx) {
    super(ctx);

    this.ctx = ctx;
    this.model = ctx.model.Question;
  }

  async findByDocument(document_id) {
    return this.model.findAll({ where: { document_id }, order: [ 'createdAt' ] });
  }

  importCSVString(project_id, csvString) {
    let rowCount = 0;
    const errors = [];

    return new Promise(resolve => {
      const stream = parse({ headers: true })
        .on('error', error => console.error(error))
        .on('data', async row => {
          const currentRow = rowCount++;
          const result = await this.processCSVRow(row, project_id);
          if (result !== true) {
            errors.push({ currentRow, error: result });
            return;
          }
        })
        .on('end', totalRows => {
          const succesfullyProcessed = totalRows - errors.length;
          resolve({ succesfullyProcessed, totalRows, rowCount, errors });
        });
      stream.write(csvString);
      stream.end();
    });
  }
  async processCSVRow(row, project_id) {
    try {
      const questionObj = {
        project_id,
        text: row.question,
        category: 'A',
        order: 0,
        external_identifier: row.question_identifier,
      };
      if (!row.question || row.question.length === 0) {
        return 'Question entry empty';
      }
      if (row.document_identifier && row.document_identifier.length > 0) {
        const doc = await this.ctx.service.documentService.findByUniqueDocumentName(
          project_id,
          row.document_identifier
        );
        if (!doc) {
          return `Document with id ${row.document_identifier} unknown in this project`;
        }
        questionObj.document_id = doc.id;
      }
      const q = await this.model.create(questionObj);
      await q.save();
      return true;
    } catch (e) {
      console.error(e);
      return e.message;
    }
  }
}

module.exports = QuestionService;
