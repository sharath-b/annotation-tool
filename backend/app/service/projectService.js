const Service = require('./baseService');
const HttpError = require('../errors/httpError');

const PROJECT_NAME_ALREADY_EXIST = 'Project name already exist.';
const ACCESS_DENIED = 'Access denied.';

class ProjectService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Project;
  }

  async getProjects(where, attributes, order) {
    const projects = await this.model.findAll({
      where,
      attributes,
      order,
    });
    return projects;
  }

  async checkIfProjectHasRightOrganization(projectId, organizationId, errorMessage = ACCESS_DENIED) {
    if (!projectId) {
      this.ctx.throw(422, 'Project Id requried');
    }
    const [ project ] = await this.getProjects({
      id: projectId,
      organization_id: organizationId,
    });

    if (!project) {
      throw new HttpError(403, errorMessage);
    }

    return project;
  }

  async createProject({ organization_id, name, annotation_mode }) {
    annotation_mode = annotation_mode || 'DEFAULT';
    const projects = await this.getProjects({ organization_id, name });
    if (projects.length > 0) {
      throw new HttpError(409, PROJECT_NAME_ALREADY_EXIST);
    }

    const newProjectValues = {
      name,
      organization_id,
      annotation_mode,
    };

    return await this.model.create(newProjectValues);
  }
}

module.exports = ProjectService;
