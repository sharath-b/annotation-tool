const Service = require('./baseService');
const Sequelize = require('sequelize');
const roles = require('./../constants/roles');

class OrganizationService extends Service {
  async getUsers(organization_id) {
    const Op = Sequelize.Op;
    const UserModel = this.ctx.model.User;
    const users = await UserModel.findAll({
      where: {
        organization_id,
        [Op.not]: [{ role: roles.ADMIN }],
      },
      attributes: [
        'id',
        'email',
        'first_name',
        'last_name',
      ],
      order: [[ 'created_at', 'DESC' ]],
    });

    return users;
  }
}

module.exports = OrganizationService;
