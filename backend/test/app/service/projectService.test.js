const { app, assert } = require('egg-mock/bootstrap');
const SeedFactory = require('../../setting/seedFactory');

describe('test/service/projectService.test.js', () => {
  let user;
  let project;

  before(async () => {
    user = await SeedFactory.seed('user', 1, { returnInputData: true });

    project = await SeedFactory.seed('project', 1, { organizationId: user.organization_id });
  });

  describe('createProject()', () => {
    it('should create and return new project', async () => {
      const ctx = app.mockContext();
      const newProjectName = 'new project';
      const { name } = await ctx.service.projectService.createProject({organization_id: user.organization_id, name: newProjectName});

      assert.equal(name, newProjectName);
    });
  });

  describe('checkIfProjectHasRightOrganization()', () => {
    it('should return project, if user have permission', async () => {
      const ctx = app.mockContext();
      const organizationId = user.organization_id;
      const projectId = project.id;
      const { id } = await ctx.service.projectService.checkIfProjectHasRightOrganization(projectId, organizationId);

      assert.equal(id, projectId);
    });
  });
});
