module.exports = () => {
  const config = exports = {};

  config.NODE_ENV = 'test';
  config.logger = {
    consoleLevel: 'DEBUG',
    disableConsoleAfterReady: true,
  };

  exports.sequelize = {
    dialect: 'postgres',
    username: process.env.CI_DB_USERNAME || 'deepannotate',
    password: process.env.CI_DB_PASSWORD || '',
    database: process.env.CI_DB_NAME || 'deepannotate',
    host: process.env.CI_DB_HOSTNAME || 'localhost',
    logging: console.log,
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
