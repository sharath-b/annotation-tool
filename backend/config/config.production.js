module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1539102769744_2629';
  config.sendMails = true;


  config.logger = {
    disableConsoleAfterReady: false,
  };

  config.jwt = {
    secret: 'HmMV5s6vV6pwhjtA',
  };

  exports.sequelize = {
    // moved to ENV variables. seee default.js
    // dialect: 'postgres',
    // database: 'deepannotate',
    // host: '127.0.0.1',
    // port: 5432,
    // username: 'postgres', // psql -d template1 -c "ALTER USER deepannotate WITH PASSWORD 'deepannotate\!';"
    // password: 'deepannotate',
    logging: false,
  };

  // GRANT ALL ON deepannotate TO deepannotate;
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
        return;
      }
      if (err.type === 'http' || err.status) {
        ctx.status = err.status;
        ctx.body = JSON.stringify({ message: err.message });
        return;
      }
      ctx.body = JSON.stringify({ message: 'Internal server error' });
    },
  };

  return config;
};

