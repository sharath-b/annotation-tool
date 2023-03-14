const bcrypt = require('bcryptjs');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkDelete('users', {
      role: 'super_admin',
    }, {});
  },

  down: queryInterface => {
    const hashOfPassword = bcrypt.hashSync('password', 10);
    const currentData = new Date();

    return queryInterface.bulkInsert('users', [{
      email: 'super_admin',
      password: hashOfPassword,
      first_name: 'Super admin',
      last_name: 'Super admin',
      created_at: currentData,
      updated_at: currentData,
      role: 'super_admin',
    }], {});
  },
};
