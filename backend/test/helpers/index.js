const links = require('./../../config/links');

module.exports = {
  async loginAndGetToken(app, credentials) {
    const { body } = await app.httpRequest()
      .post(links.login)
      .send({
        email: credentials.email,
        password: credentials.password,
      });

    return body.token;
  },
  getBasicAuthToken(name, pass) {
    return 'Basic ' + new Buffer(name + ':' + pass).toString('base64');
  },
};
