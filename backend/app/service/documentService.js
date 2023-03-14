const Service = require('./baseService');
const { parse } = require('fast-csv');
const crypto = require('crypto');
const eol = require('eol');

class DocumentService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Document;
  }

  async getPaginationData(project_id, document_id) {
    const documentsInProject = await this.model.findAll({
      where: { project_id },
      attributes: [ 'id' ],
      order: [
        [ 'order', 'ASC' ],
        [ 'id', 'ASC' ],
      ],
    });

    const currentDocumentIndex = documentsInProject.findIndex(
      ({ id }) => id === +document_id
    );
    const prevDocumentIndex = documentsInProject[currentDocumentIndex - 1]
      ? documentsInProject[currentDocumentIndex - 1].id
      : null;
    const nextDocumentIndex = documentsInProject[currentDocumentIndex + 1]
      ? documentsInProject[currentDocumentIndex + 1].id
      : null;

    return {
      prev: prevDocumentIndex,
      current: documentsInProject[currentDocumentIndex].id,
      next: nextDocumentIndex,
      length: documentsInProject.length,
      currentPosition: currentDocumentIndex + 1,
    };
  }
  async findByUniqueDocumentName(project_id, name) {
    const doc = await this.model.findOne({
      where: { unique_document_name: name, project_id },
    });
    return doc;
  }

  importCSVString(project_id, user_id, csvString) {
    let rowCount = 0;
    const errors = [];

    return new Promise(resolve => {
      const stream = parse({ headers: true })
        .on('error', error => console.error(error))
        .on('data', async row => {
          const currentRow = rowCount++;

          const result = await this.processCSVRow(row, project_id, user_id);
          if (result !== true) {
            errors.push({ currentRow, error: result });
            return;
          }
        })
        .on('end', totalRows => {
          resolve({ totalRows, rowCount, errors });
        });
      stream.write(csvString);
      stream.end();
    });
  }
  async processCSVRow(row, project_id, user_id) {
    try {
      if (!row.document_text) {
        return 'Document text not available';
      }
      row.order = parseInt(row.order);
      if (row.document_identifier && row.document_identifier.length === 0) {
        delete row.document_identifier;
      }
      const documentObj = {
        unique_document_name: row.document_identifier,
        text: row.document_text,
        order: row.order || 0,
      };
      await this.createNewDocument(project_id, user_id, documentObj);
    } catch (e) {
      return e.message;
    }
  }
  async createNewDocument(project_id, user_id, values, file_name = '') {
    const doc = { project_id, user_id, file_name, ...values };
    if (!project_id) {
      throw new Error('project id is required to create a document');
    }
    if (!user_id) {
      throw new Error('user id is required to create a document');
    }
    if (!doc.text) {
      throw new Error('text is required to create a document');
    }
    if (!doc.order) {
      doc.order = 0;
    }

    doc.text = eol.lf(doc.text);

    const hash = crypto
      .createHash('md5')
      .update(doc.text + project_id)
      .digest('hex');

    const duplicate = await this.model.findOne({
      where: {
        hash,
        project_id,
      },
    });
    if (duplicate) {
      duplicate.text = doc.text;
      await duplicate.save();
      return duplicate;
    }

    const record = await this.model.create(doc);
    return await record.save();
  }
}
module.exports = DocumentService;
