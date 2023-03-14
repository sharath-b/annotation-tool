module.exports = {
  registration: {
    first_name: 'string',
    last_name: 'string',
    organization_name: 'string',
    password: 'string',
    email: 'string',
    agreement: 'boolean',
  },
  login: {
    password: 'string',
    email: 'string',
  },
  newUserInOrganization: {
    first_name: 'string',
    last_name: 'string',
    email: 'string',
  },
  resetPassword: {
    newPassword: 'string',
  },
  createSuperAdmin: {
    login: 'string',
    password: 'string',
    confirm_password: 'string',
  },
};
