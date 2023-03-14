const _ = require('lodash');
const { ApiController } = require('./base');
const validation = require('../validation/query/answer');

class DocumentController extends ApiController {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Answer;
    this.name = 'Answer';
  }

  async index() {
    const { id: user_id } = this.ctx.state.user;
    const document_id = this.ctx.params.id;
    const { showAllLabels } = this.ctx.query;
    const whereOptions = { document_id };

    if (showAllLabels !== 'true') {
      whereOptions.user_id = user_id;
    }

    await super.index(whereOptions);
  }

  async create() {
    const data = this.ctx.request.body;
    const document_id = this.ctx.params.id;
    data.document_id = document_id;

    const { answer_category } = data;
    let currentValidation = validation.create;
    if (
      answer_category === 'NOT_UNDERSTOOD' ||
      answer_category === 'NOT_GIVEN'
    ) {
      currentValidation = validation.create_no_answer;
    }

    this.validate(currentValidation);

    await this.checkIfAllowedToEdit(document_id);
    const user = this.ctx.state.user;

    data.user_id = user.id;
    const where = _.pick(data, 'document_id', 'question_id');
    await this.checkIfAnsweredByOtherPerson(where);

    const response = await this._updateOrCreate(where, data);
    this.success(response);
  }

  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    const user = this.ctx.state.user;
    const existingAnswer = await this.model.findByPk(id);
    if (
      existingAnswer &&
      existingAnswer.user_id &&
      existingAnswer.user_id !== user.id
    ) {
      const user = await this.ctx.model.User.findByPk(existingAnswer.user_id);
      this.ctx.throw(
        403,
        `This label was created by ${user.email}. So you cannot delete it.`
      );
    }
    await super.destroy();
  }

  async checkIfAnsweredByOtherPerson(where) {
    // check
    const user = this.ctx.state.user;
    const existingAnswer = await this.ctx.model.Answer.findOne({ where });

    if (
      existingAnswer &&
      existingAnswer.user_id &&
      existingAnswer.user_id !== user.id
    ) {
      const user = await this.ctx.model.User.findByPk(existingAnswer.user_id);
      this.ctx.throw(
        403,
        `User id ${user.email} already answered this question on this document.`
      );
    }
  }

  async export() {
    const result = await this.ctx.service.answerService.getAnswersToExport();
    this.success(result);
  }

  async exportInSquadFormat() {
    const { ctx } = this;
    const { id: projectId } = ctx.params;
    const { isMyLabels } = ctx.query;
    const user = ctx.state.user;
    const squadExportService = ctx.service.exports.squadExportService;
    let result;

    await this.service.projectService.checkIfProjectHasRightOrganization(
      projectId,
      user.organization_id
    );

    if (isMyLabels === 'true') {
      result = await squadExportService.getDataInSquadFormatToExport(
        projectId,
        user.id
      );
    } else {
      result = await squadExportService.getDataInSquadFormatToExport(
        projectId
      );
    }
    const exportString = JSON.stringify({ data: result });
    this.success(exportString);
  }

  async exportInCSVFormat() {
    const { ctx } = this;
    const { id: projectId } = ctx.params;
    const { isMyLabels } = ctx.query;
    const user = ctx.state.user;
    const squadExportService = ctx.service.exports.squadExportService;
    let result;
    await this.service.projectService.checkIfProjectHasRightOrganization(
      projectId,
      user.organization_id
    );

    if (isMyLabels === 'true') {
      result = await squadExportService.getDataInCSVFormatToExport(
        projectId,
        user.id
      );
    } else {
      result = await squadExportService.getDataInCSVFormatToExport(
        projectId
      );
    }

    this.success(result);
  }

  async getAnswers() {
    const { id: project_id } = this.ctx.params;
    const user = this.ctx.state.user;

    await this.service.projectService.checkIfProjectHasRightOrganization(
      project_id,
      user.organization_id
    );

    const result = await this.ctx.service.answerService.getAnswers(project_id);

    this.success(result);
  }

  async checkIfAllowedToEdit(document_id) {
    const { state } = this.ctx;
    const user = state.user; // fetch from database or session
    const document = await this.ctx.model.Document.findByPk(document_id);
    if (!document.user_id) {
      document.user_id = user.id;
      await document.save();
    }
    // if (document.user_id !== user.id) {
    //   const user = await this.ctx.model.User.findByPk(document.user_id);
    //   this.ctx.throw(403, `User id ${user.email} is already working on this document`);
    // }
  }
}

module.exports = DocumentController;
