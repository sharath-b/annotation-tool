const path = require('path');
const links = require('./links');
require('dotenv').config();

module.exports = appInfo => {
  const config = (exports = {});
  config.dbVersion = 5;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1539102769744_2629';
  config.NODE_ENV = 'testing';
  config.sendMails = false;
  config.mailDir = '../app/mail/';
  config.defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'start123'; // should never be used.
  config.defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'default@admin.com';
  config.defaultPasswordChanged = config.defaultPassword !== 'start123';

  exports.sequelize = {
    username: process.env.PROD_DB_USERNAME || 'deepannotate',
    password: process.env.PROD_DB_PASSWORD || '',
    database: process.env.PROD_DB_NAME || 'deepannotate',
    host: process.env.PROD_DB_HOSTNAME || 'localhost',
    dialect: 'postgres',
    port: 5432,
  };

  config.security = {
    domainWhiteList: [ '*' ],
    csrf: {
      enable: false,
    },
  };

  config.jwt = {
    secret: '123456',
  };

  config.validate = {
    convert: true,
    // validateRoot: false,
  };

  config.middleware = [ 'authorize', 'checkSuperAdmin' ];

  config.authorize = {
    ignore: [
      '/index.html',
      links.superAdmin_checkSuperAdmin,
      links.superAdmin_createSuperAdmin,
      links.apiAlive,
      links.login,
      links.registration,
      links.documentation,
      links.alive,
      links.apiInit,
    ],
  };
  // config/config.default.js
  exports.notfound = {
    pageUrl: '/index.html',
  };

  config.checkSuperAdmin = { match: links.superAdminPrefix };

  exports.multipart = {
    mode: 'file',
    fileSize: '250mb',
    whitelist: [ '.txt', '.csv' ],
  };

  config.static = {
    prefix: '/',
    dir: path.join(appInfo.baseDir, '../frontend/build'),
    dynamic: true,
  };


  config.view = {
    defaultViewEngine: 'ejs',
    defaultExtension: '.ejs',
    mapping: {
      '.ejs': 'ejs',
    },
  };

  config.validate = {};

  config.onerror = {
    all(err, ctx) {
      if (err.type === 'http') {
        ctx.status = err.status;
      }

      const error = {
        message: err.message,
      };

      if (err.code === 'invalid_param') {
        error.errors = err.errors;
      }

      ctx.body = JSON.stringify(error);
    },
  };


  // config.customLogger = {
  //   scheduleLogger: {
  //     consoleLevel: 'NONE',
  //     file: 'egg-schedule.log',
  //   },
  // };

  exports.logger = {
    consoleLevel: 'DEBUG',
    disableConsoleAfterReady: false,
  };

  return config;
};
