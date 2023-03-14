const { BaseController } = require('./base');
const HttpError = require('../errors/httpError');
const validation = require('../validation/query/organization');
const userValidation = require('../validation/query/user');
const roles = require('./../constants/roles');

const ORGANIZATION_NOT_FOUND = 'Organization not found.';
const USER_NOT_FOUND = 'User not found.';

class SuperAdminController extends BaseController {
  async getOrganizations() {
    const allOrganizations = await this.ctx.model.Organization.findAll({
      attributes: [ 'id', 'name', 'created_at' ],
      order: [[ 'created_at', 'DESC' ]],
    });

    this.success(allOrganizations);
  }

  async getOrganization(id) {
    const organization = await this.ctx.model.Organization.findByPk(id);

    if (!organization) {
      throw new HttpError(404, ORGANIZATION_NOT_FOUND);
    }

    return organization;
  }

  async get() {
    const { id: organizationId } = this.ctx.params;

    this.validate(validation.checkId, { id: +organizationId });

    const organization = await this.getOrganization(organizationId);

    this.success({ organization });
  }

  async delete() {
    const { id: organizationId } = this.ctx.params;

    this.validate(validation.checkId, { id: +organizationId });

    const organization = await this.getOrganization(organizationId);

    await organization.destroy();

    this.success({ deletedOrganization: organizationId });
  }

  async update() {
    const { id: organizationId } = this.ctx.params;
    const { name } = this.ctx.request.body;

    this.validate(validation.update, {
      id: +organizationId,
      name,
    });

    const organization = await this.getOrganization(organizationId);

    organization.set('name', name);
    await organization.save();

    this.success({ editedOrganization: organization });
  }

  async getUsers() {
    const { id: organizationId } = this.ctx.params;

    this.validate(validation.checkId, { id: +organizationId });

    const users = await this.ctx.model.User.findAll({
      where: { organization_id: organizationId },
      attributes: [ 'id', 'first_name', 'last_name', 'role', 'email', 'created_at' ],
      order: [[ 'created_at', 'DESC' ]],
    });

    this.success(users);
  }

  async getProjects() {
    const { id: organizationId } = this.ctx.params;

    this.validate(validation.checkId, { id: +organizationId });

    const projects = await this.ctx.model.Project.findAll({
      where: { organization_id: organizationId },
      attributes: [ 'id', 'name', 'created_at' ],
      order: [[ 'created_at', 'DESC' ]],
    });

    this.success(projects);
  }

  async loginAs() {
    const { id: userId } = this.ctx.params;

    this.validate(validation.checkId, { id: +userId });

    const user = await this.ctx.model.User.findByPk(userId, {
      attributes: [
        'id',
        'email',
        'role',
        'first_name',
        'last_name',
        'organization_id',
      ],
    });

    if (!user) {
      throw new HttpError(404, USER_NOT_FOUND);
    }

    const token = this.ctx.service.userService.getSignedJWT(user);

    this.success({ token, userInfo: user });
  }

  async checkIfSuperAdminAlreadyExist() {
    const superAdmin = await this.ctx.model.User.findOne({ where: { role: roles.SUPER_ADMIN } });

    this.success({ isSuperAdminCreated: superAdmin !== null });
  }

  async createSuperAdmin() {
    const newSuperAdminData = this.ctx.request.body;
    const oldSuperAdmin = await this.ctx.model.User.findOne({ where: { role: roles.SUPER_ADMIN } });

    if (oldSuperAdmin) {
      this.forbidden('Super admin already created.');
    }

    this.validate(userValidation.createSuperAdmin, newSuperAdminData);

    await this.ctx.service.superAdminService.createSuperAdmin(newSuperAdminData);

    this.success();
  }
}

module.exports = SuperAdminController;
