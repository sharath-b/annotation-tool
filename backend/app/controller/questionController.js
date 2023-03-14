const { ApiController } = require('./base');
const fs = require('mz/fs');
const validation = require('../validation/query/question');
const Sequelize = require('sequelize');


class DocumentController extends ApiController {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Question;
    this.name = 'Question';
    this.validation = validation;
    this.order = [
      [ 'order', 'ASC' ],
      [ 'text', 'ASC' ],
      [ 'created_at', 'ASC' ],
    ];
  }
  async showQuestionsOfProject() {

    const { includeDocumentLevelQuestions } = this.ctx.query;
    const { id: project_id } = this.ctx.params;
    const { organization_id } = this.ctx.state.user;
    const additionalOptions = {};

    if (!project_id) {
      this.ctx.throw(422, 'project id is required');
    }

    await this.service.projectService.checkIfProjectHasRightOrganization(
      project_id,
      organization_id
    );

    additionalOptions.project_id = project_id;
    if (
      !includeDocumentLevelQuestions ||
      includeDocumentLevelQuestions === 'false'
    ) {
      additionalOptions.document_id = { [Sequelize.Op.eq]: null };
    }

    await super.index(additionalOptions);
  }

  /*
   * epreacted, there is no need for this method anymore, see method above;
   */
  async index() {
    const { project_id, includeDocumentLevelQuestions } = this.ctx.query;
    const { organization_id } = this.ctx.state.user;
    const additionalOptions = {};

    if (!project_id) {
      this.ctx.throw(422, 'project id is required');
    }

    await this.service.projectService.checkIfProjectHasRightOrganization(
      project_id,
      organization_id
    );
    additionalOptions.project_id = project_id;
    if (
      !includeDocumentLevelQuestions ||
      includeDocumentLevelQuestions === 'false'
    ) {
      additionalOptions.document_id = { [Sequelize.Op.eq]: null };
    }

    await super.index(additionalOptions);
  }


  async create() {
    const {
      isGlobalQuestion,
      document_id,
      project_id,
      ...body
    } = this.ctx.request.body;
    const { organization_id } = this.ctx.state.user;

    const newBody = { ...body };
    await this.service.projectService.checkIfProjectHasRightOrganization(
      project_id,
      organization_id
    );
    newBody.project_id = +project_id;
    if (!isGlobalQuestion) {
      newBody.document_id = document_id;
    }

    this.validate(this.validation.create, newBody);

    const record = await this.model.create(newBody);

    this.success({ data: record });
  }
  async importCsv() {
    const { project_id } = this.ctx.request.body;
    const user = this.ctx.state.user;
    if (!this.ctx.request.files || !this.ctx.request.files[0]) {
      this.ctx.throw(422, 'FILE_MISSING');
    }
    const file = this.ctx.request.files[0];
    await this.service.projectService.checkIfProjectHasRightOrganization(
      project_id,
      user.organization_id
    );
    const rawFile = await fs.readFile(file.filepath, 'utf8');
    const result = await this.service.questionService.importCSVString(
      project_id,
      rawFile
    );
    result.succesfullyProcessed = result.totalRows - result.errors.length;
    this.success({ result });
  }

  async destroy() {
    // deleteAnswersOfQuestion
    // Maybe we should block to delete a question if it has answers.
    // const record = await this.model.findByPk(this.ctx.params.id);
    // @todo what about removing relationships?
    // await record.destroy();
    await super.destroy();
  }
}

module.exports = DocumentController;
