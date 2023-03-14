
module.exports = appInfo => {
  const config = exports = {};
  config.keys = appInfo.name + '_1539102769744_2629';
  config.sendMails = true;

  exports.sequelize = {
    // dialect: 'postgres',
    // database: 'deepannotate_dev',
    // host: '127.0.0.1',
    // port: 5432,
    // username: 'deepannotate_dev',
    // password: 'deepannotate!',
    logging: false,
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };


  config.onerror = {
    all(err, ctx) {
      if (err.code === 'invalid_param') {
        const error = {
          statusCode: ctx.status,
          message: err.message,
          errors: err.errors,
        };
        ctx.body = JSON.stringify(error);
      } else if (err.status) {
        ctx.status = err.status;
        ctx.body = JSON.stringify({ message: err.message });
      } else {
        ctx.body = JSON.stringify({ message: 'Internal server error' });
      }
    },
  };

  return config;
};
