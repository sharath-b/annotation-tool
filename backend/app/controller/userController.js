const { BaseController } = require('./base');
const userValidation = require('./../validation/query/user');
const roles = require('./../constants/roles');

class UserController extends BaseController {
  async login() {
    const { email, password } = this.ctx.request.body;

    this.validate(userValidation.login, this.ctx.request.body);

    const token = await this.ctx.service.userService.login(email, password);
    this.ctx.body = {
      token,
    };
  }

  async registration() {
    const { registrationData } = this.ctx.request.body;

    this.validate(userValidation.registration, registrationData);

    await this.ctx.service.userService.registration(registrationData);

    this.success();
  }

  async addNewUserToOrganization() {
    const { userInfo } = this.ctx.request.body;
    const { organization_id } = this.ctx.state.user;

    this.validate(userValidation.newUserInOrganization, userInfo);

    const newUser = await this.ctx.service.userService.addNewUserToOrganization(userInfo, organization_id);

    this.success(newUser);
  }

  async info() {
    const { state } = this.ctx;
    const userData = { user: state.user }; // fetch from database or session
    this.ctx.body = userData;
  }

  async resetPassword() {
    const { newPassword } = this.ctx.request.body;
    const { role, organization_id } = this.ctx.state.user;
    const userId = this.ctx.params.id;

    this.validate(userValidation.resetPassword, this.ctx.request.body);

    if (role !== roles.SUPER_ADMIN && role !== roles.ADMIN) {
      this.forbidden();
    }

    if (role === roles.ADMIN) {
      await this.ctx.service.userService.checkIfUserHasRightOrganization(userId, organization_id);
    }

    const updatedPassword = await this.ctx.service.userService.resetPassword(userId, newPassword);

    this.success({ newPassword: updatedPassword });
  }
}

module.exports = UserController;
