const { ApiController } = require('./base');
const validation = require('../validation/query/document');
const fs = require('mz/fs');

const extractTextFromPdf = require('./../../core/utils/extractTextFromPdf');
const roles = require('./../constants/roles');

class DocumentController extends ApiController {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Document;
    this.name = 'Document';
    this.validation = validation;
    this.order = [
      [ 'order', 'ASC' ],
      [ 'id', 'ASC' ],
    ];
  }

  async index() {
    const { id: project_id } = this.ctx.params;
    const { service } = this;
    const { organization_id } = this.ctx.state.user;


    await this.service.projectService.checkIfProjectHasRightOrganization(
      project_id,
      organization_id
    );

    const { criteria, options } = await this.checkAndBuildQuery(this.ctx.query);
    const where = {
      ...criteria,
      project_id,
    };
    const attributes = { exclude: [ 'hash', 'order', 'project_id' ] };
    const page = await service.paginationService.findAll(
      this.model,
      where,
      options,
      attributes
    );

    page.entries.map(x => {
      if (x.text) {
        x.textlength = x.text.length;
        x.text = x.text.substr(0, 100);
      }
      return x;
    });

    return this.success(page);
  }

  async show() {
    const document_id = this.ctx.params.id;
    const record = await this._findDocument(document_id);
    const { organization_id } = this.ctx.state.user;

    await this.service.projectService.checkIfProjectHasRightOrganization(
      record.project_id,
      organization_id,
      'Document not found.'
    );

    let questions = await this.service.questionService.findByDocument(
      document_id
    );
    questions = questions.map(q => q.get({ plain: true }));

    const user = this.ctx.state.user;
    let answers = await this.service.answerService.findByDocumentAndLabler(
      document_id,
      user.id
    );

    // let answers = await this.service.answerService.findByDocument(document_id);
    answers = answers.map(q => q.get({ plain: true }));
    const document = record.get({ plain: true });

    const pagination = await this.ctx.service.documentService.getPaginationData(
      record.project_id,
      document_id
    );

    // avoid html tags processed in ui
    document.text = document.text.replace(/</gi, '‹');
    const response = {
      pagination,
      document,
      questions, // document only questions
      answers,
    };

    return this.success(response);
  }

  async importCsv() {
    const { project_id } = this.ctx.request.body;
    const { organization_id } = this.ctx.state.user;
    const user = this.ctx.state.user;
    if (!this.ctx.request.files || !this.ctx.request.files[0]) {
      this.ctx.throw(422, 'FILE_MISSING');
    }
    const file = this.ctx.request.files[0];
    await this.service.projectService.checkIfProjectHasRightOrganization(
      project_id,
      organization_id
    );
    const rawFile = await fs.readFile(file.filepath, 'utf8');
    const result = await this.service.documentService.importCSVString(
      project_id,
      user.id,
      rawFile
    );
    result.succesfullyProcessed = result.totalRows - result.errors.length;
    this.success({ result });
  }

  async destroy() {
    const { organization_id, role } = this.ctx.state.user;
    const { id } = this.ctx.params;

    if (role !== roles.ADMIN) {
      this.forbidden('Only admin can delete documents.');
    }

    const document = await this._findDocument(id);

    await this.service.projectService.checkIfProjectHasRightOrganization(
      document.project_id,
      organization_id
    );
    await document.destroy();

    this.success({ id });
  }

  async unlinkDocumentLabeler() {
    const document_id = this.ctx.params.id;
    const record = await this.model.findByPk(document_id);
    if (!record) {
      return this.notFound(this.name);
    }
    record.user_id = null;
    await record.save();
    this.success();
  }

  async attachTextfileToDocument() {
    const { ctx } = this;
    const file = ctx.request.files[0];

    const document_id = this.ctx.params.id;

    const record = await this._findDocument(document_id);
    const text = await fs.readFile(file.filepath);
    // normalize text / windows CRLF
    record.text = text.replace(/\r\n/g, '\n').replace(/<(.*)>/g, '$1');
    await record.save();
    this.success();
  }

  async documentFromFile() {
    const { ctx } = this;
    const { id: project_id } = ctx.params;
    const { id: user_id, organization_id } = ctx.state.user;
    const file = ctx.request.files[0];

    await this.service.projectService.checkIfProjectHasRightOrganization(
      project_id,
      organization_id
    );

    let text;

    if (file.mimeType === 'application/pdf') {
      text = await extractTextFromPdf(file.filepath);
    } else {
      text = await fs.readFile(file.filepath, 'utf8');
    }

    if (!text) {
      this.forbidden(
        'Something went wrong, while the file was processing. Please make sure the file is not corrupted and has a valid extension.'
      );
    }


    const documentSizeAfterExtracting = Buffer.byteLength(text, 'utf8');
    console.log(documentSizeAfterExtracting);
    if (documentSizeAfterExtracting > 1e7) {
      this.forbidden('The file size exceeded.');
    }
    const document = {
      text,
    };

    const record = await this.ctx.service.documentService.createNewDocument(
      project_id,
      user_id,
      document,
      file.filename
    );
    this.success({ data: record });
  }

  async _findDocument(id) {
    const document_id = id;
    const record = await this.model.findByPk(document_id);
    if (!record) {
      return this.notFound(this.name);
    }
    return record;
  }
}

module.exports = DocumentController;
