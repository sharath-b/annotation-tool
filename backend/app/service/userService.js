const bcrypt = require('bcryptjs');
const _ = require('lodash');

const Service = require('./baseService');
const HttpError = require('../errors/httpError');
const crypto = require('crypto');
const roles = require('./../constants/roles');
// const generatePassword = require('password-generator');
const FORBIDDEN_MESSAGE = 'Forbidden. Email or password is invalid.';
const EMAIL_ALREADY_EXIST = 'Email already exists.';
const NOT_FOUND_MESSAGE = 'Forbidden. User is not known.';
const ORGANIZATION_ALLREADY_EXIST = 'This organization already exists.';

const { Op } = require('sequelize');


// const EIGHT_CHAR_NUMBER_SPECIAL_CHAR_REGEX = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';

class UserService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.User;
    this.ctx = ctx;
    this.name = 'user';
  }

  async registration(userData) {
    const newUser = { ...userData };
    const { email } = newUser;
    const { password, organization_name } = newUser;

    newUser.email = email.toLowerCase();

    const foundUser = await this.findOne({
      where: { email: { [Op.iLike]: newUser.email } },
    });

    if (foundUser) {
      throw new HttpError(422, EMAIL_ALREADY_EXIST);
    }

    await this.checkIfOrganizationExist({ name: organization_name });

    const newOrganization = await this.createNewOrganization({
      name: organization_name,
    });

    newUser.password = bcrypt.hashSync(password, 10);
    newUser.organization_id = newOrganization.id;
    newUser.role = roles.ADMIN;

    const user = await this.create(newUser);

    await user.save();
  }

  async createNewOrganization(entity) {
    const organizationModel = this.ctx.model.Organization;
    const newOrganization = await organizationModel.create(entity);

    await newOrganization.save();

    return newOrganization;
  }

  async checkIfOrganizationExist(where) {
    const organizationModel = this.ctx.model.Organization;
    const foundOrganization = await organizationModel.findOne({ where });

    if (foundOrganization) {
      throw new HttpError(422, ORGANIZATION_ALLREADY_EXIST);
    }
  }

  async login(email, password, options = {}) {
    email = email.toLowerCase();

    console.log({ where: { [Op.iLike]: email } });
    const user = await this.findOne({
      where: { email: { [Op.iLike]: email } },
    });

    // this.findOne({ where: { [Op.iLike]: email } });

    if (!user) {
      throw new HttpError(403, NOT_FOUND_MESSAGE);
    }

    const isPasswordValid = await this.checkPassword(user, password);

    if (!isPasswordValid) {
      throw new HttpError(403, FORBIDDEN_MESSAGE);
    }
    user.last_login = new Date();
    await user.save();

    return this.getSignedJWT(user, options);
  }

  getSignedJWT(user, options = {}) {
    const payload = _.pick(user, [ 'id', 'email', 'role' ]);
    if (options.basic) {
      return payload;
    }

    return this.app.jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
      this.app.config.jwt.secret
    );
  }

  async checkPassword(user, password) {
    const checked = await bcrypt.compareSync(password, user.password);

    return checked;
  }

  async checkIfUserHasRightOrganization(userId, organizationId) {
    const user = this.findOne({ id: userId });

    if (!user) {
      throw new HttpError(403, 'Forbidden');
    }

    return userId === organizationId;
  }

  async addNewUserToOrganization(userInfo, organization_id) {
    const { email, first_name, last_name } = userInfo;
    const foundUser = await this.findOne({ where: { email } });

    if (foundUser) {
      throw new HttpError(422, EMAIL_ALREADY_EXIST);
    }

    const timestamp = Date.now();
    let temporaryPassword = crypto
      .createHash('md5')
      .update(`${timestamp}${email}`)
      .digest('hex');
    temporaryPassword = temporaryPassword.substr(0, 5);

    const password = bcrypt.hashSync(temporaryPassword, 10);

    const newUser = {
      email,
      first_name,
      last_name,
      organization_id,
      role: roles.USER,
      password,
    };

    await this.create(newUser);

    const userDataForSend = {
      email,
      first_name,
      last_name,
      password: temporaryPassword,
    };

    return userDataForSend;
  }

  async resetPassword(userId, newPassword) {
    const user = await this.findById(userId);

    if (!user) {
      throw new HttpError(403, 'Forbidden');
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);

    user.set('password', passwordHash);
    await user.save();

    return newPassword;
  }
  async setupDefaultUser() {
    const User = this.ctx.model.User;

    const password = this.app.config.defaultPassword;
    const passwordWasChanged = this.app.config.defaultPasswordChanged;
    const where = { email: this.app.config.defaultEmail };

    let user = await User.findOne({ where });
    if (!passwordWasChanged) {
      console.warn(
        'WARNING: You did not set an default admin password! This is unsecure, please check your .env file!'
      );
    }
    if (!user) {
      where.role = roles.SUPER_ADMIN;
      user = await User.create(where);
      user.password = bcrypt.hashSync(password, 10);
      await user.save();
    }
    return { userid: user.id, email: user.email };
  }
}

module.exports = UserService;
