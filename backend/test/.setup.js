
const { app } = require('egg-mock/bootstrap');
const { promisify } = require('util');

before(async () => {
  await app.ready();
});
