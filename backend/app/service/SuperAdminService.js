const bcrypt = require('bcryptjs');
const Service = require('./baseService');
const roles = require('./../constants/roles');

class SuperAdminService extends Service {
  async createSuperAdmin({ login, password }) {
    const passwordHash = bcrypt.hashSync(password, 10);

    const newSuperAdmin = {
      email: login,
      first_name: 'Super admin',
      last_name: 'Super admin',
      password: passwordHash,
      role: roles.SUPER_ADMIN,
    };

    const superAdmin = await this.ctx.model.User.create(newSuperAdmin);

    await superAdmin.save();
  }
}

module.exports = SuperAdminService;
