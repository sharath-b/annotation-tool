const { BaseController } = require('./base');
const HttpError = require('../errors/httpError');
const roles = require('./../constants/roles');

const FORBIDDEN_MESSAGE = 'Forbidden. User is not admin';

class OrganizationController extends BaseController {
  async getUsers() {
    const {
      role,
      organization_id,
    } = this.ctx.state.user;

    if (role !== roles.ADMIN) {
      throw new HttpError(403, FORBIDDEN_MESSAGE);
    }

    const users = await this.ctx.service.organizationService.getUsers(organization_id, role);

    this.success(users);
  }
}

module.exports = OrganizationController;
