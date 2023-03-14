// had enabled by egg
exports.static = true;

// config/plugin.js
// exports.jwt = {
//   enable: true,
//   package: 'egg-jwt',
// };

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};


exports.validate = {
  enable: true,
  package: 'egg-validate',
};


exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};
