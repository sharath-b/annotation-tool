const { BaseController } = require('./base');
const projectValidation = require('./../validation/query/project');
const _ = require('lodash');

class ProjectController extends BaseController {
  async createProject() {
    const requestBody = this.ctx.request.body;
    const { organization_id } = this.ctx.state.user;

    this.validate(projectValidation.create, requestBody);

    const newProject = await this.ctx.service.projectService.createProject({
      organization_id,
      name: requestBody.name,
      annotation_mode: requestBody.annotation_mode,
    });

    const outputProject = _.pick(
      newProject,
      'id',
      'name',
      'annotation_mode',
      'created_at',
      'updated_at'
    );

    this.success(outputProject);
  }

  async delete() {
    const { id } = this.ctx.params;
    const { organization_id } = this.ctx.state.user;

    const record = await this.ctx.service.projectService.checkIfProjectHasRightOrganization(
      id,
      organization_id
    );

    await record.destroy();

    this.success({ id });
  }

  async getProject() {
    const { organization_id } = this.ctx.state.user;
    const projects = await this.ctx.service.projectService.getProjects(
      { organization_id },
      [ 'id', 'name', 'annotation_mode', 'updated_at', 'created_at' ],
      [[ 'created_at', 'DESC' ]]
    );

    this.success(projects);
  }
}

module.exports = ProjectController;
