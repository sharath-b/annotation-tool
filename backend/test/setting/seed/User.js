const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Base = require('./Base');
const roles = require('./../../../app/constants/roles');
const {
  internet,
  random,
  company,
  name: fakeName,
} = require('faker');

class User extends Base {
  constructor(app) {
    super(app);
    this.model = app.model.User;
  }

  createRecord({ role }) {
    const salt = bcrypt.genSaltSync(10);
    const password = crypto.randomBytes(4).toString('hex');
    const passwordHash = bcrypt.hashSync(password, salt);

    return {
      id: random.number(10000000),
      email: internet.email().toLowerCase(),
      first_name: fakeName.firstName(),
      last_name: fakeName.lastName(),
      organization_id: random.number(10000),
      organization_name: company.companyName(),
      role: role || roles.ADMIN,
      agreement: true,
      password: passwordHash,
      authentication: {
        password: passwordHash,
        passwordPlain: password,
        passwordSalt: salt,
      },
    };
  }
}

module.exports = User;
