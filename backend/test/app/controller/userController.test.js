const { app, assert } = require('egg-mock/bootstrap');
const SeedFactory = require('./../../setting/seedFactory');
const { loginAndGetToken } = require('./../../helpers');
const links = require('./../../../config/links');
const {
  name: fakeName,
  internet,
} = require('faker');

describe('app/controller/userController', () => {
  let lastRegisteredUser;
  let userCredentials;
  let userDataForRegistration;

  before(async () => {
    const {
      email,
      first_name,
      last_name,
      agreement,
      authentication: {
        passwordPlain: password,
      },
    } = await SeedFactory.seed('user', 1, { returnInputData: true });

    userCredentials = {
      email,
      password,
    };

    userDataForRegistration = {
      email,
      first_name,
      last_name,
      agreement,
      password,
    };
  });

  describe('POST api/user/registration', () => {
    it('should post /registration', async () => {
      lastRegisteredUser = {
        email: internet.email().toLowerCase(),
        password: userDataForRegistration.password,
      };

      return (
        await app.httpRequest()
          .post(links.registration)
          .send({
            registrationData: {
              ...userDataForRegistration,
              ...lastRegisteredUser,
              organization_name: fakeName.jobTitle(),
            },
          })
          .expect(200)
      );
    });

    it('should show error \'To continue registration, please, confirm agreement.\'', async () => {
      const registrationData = {
        ...userDataForRegistration,
        organization_name: fakeName.jobTitle(),
        agreement: false,
      };

      return (
        await app.httpRequest()
          .post(links.registration)
          .send({ registrationData })
          .expect(422)
      );
    });

    it('should show error: "Validation error"', async () => {
      return (
        await app.httpRequest()
          .post(links.registration)
          .expect(422)
      );
    });

    it('should show error \'Email already exist.\'', () => {
      return app.httpRequest()
        .post(links.registration)
        .send(userDataForRegistration)
        .expect(422);
    });
  });

  describe('POST api/login login()', () => {
    it('should post /login', async () => {
      const { body } = await app.httpRequest()
        .post(links.login)
        .send(lastRegisteredUser)
        .expect(200);

      lastRegisteredUser.token = body.token;
    });

    it('should require an email', async () => (
      await app.httpRequest()
        .post(links.login)
        .send({ password: lastRegisteredUser.password })
        .expect(422)
    ));

    it('should require a password', async () => (
      await app.httpRequest()
        .post(links.login)
        .send({ email: lastRegisteredUser.email })
        .expect(422)
    ));

    it('should return 403 if user not found', async () => (
      await app.httpRequest()
        .post(links.login)
        .send({ email: 'florinwork525@gmail.com1', password: 'somePass' })
        .expect(403)
    ));

    it('should validate password', async () => (
      await app.httpRequest()
        .post(links.login)
        .send({ email: userCredentials.email, password: 'dd2015!12' })
        .expect(403)
    ));
  });

  describe('POST api/organization/user', async () => {
    const userDataForAddToOrganization = {
      email: internet.email(),
      first_name: fakeName.firstName(),
      last_name: fakeName.lastName(),
    };

    it('should post /add_to_organization', async () => {
      const token = await loginAndGetToken(app, lastRegisteredUser);

      return (
        await app.httpRequest()
          .post(links.addUserToOrganization)
          .set('Authorization', `Bearer ${token}`)
          .send({
            userInfo: { ...userDataForAddToOrganization },
          })
          .expect(200)
      );
    });

    it('should show error \'Validation error.\'', async () => {
      const token = await loginAndGetToken(app, lastRegisteredUser);

      return (
        await app.httpRequest()
          .post(links.addUserToOrganization)
          .set('Authorization', `Bearer ${token}`)
          .expect(422)
      );
    });

    it('should show error \'Email already exist.\'', async () => {
      const token = await loginAndGetToken(app, lastRegisteredUser);

      return (
        await app.httpRequest()
          .post(links.addUserToOrganization)
          .set('Authorization', `Bearer ${token}`)
          .send({ userInfo: userDataForAddToOrganization })
          .expect(422)
      );
    });
  });

  describe('GET user/info', () => {
    it('should not be possible to access without jwt token', async () => {
      const response = await app.httpRequest().get(links.userInfo);
      assert.equal(response.status, 401);
      assert.ok(/No authorization token was found/.test(response.text));
    });

    it('should return user info', async () => {
      const { status, body, text } = await app.httpRequest()
        .get(links.userInfo)
        .set('Authorization', `Bearer ${lastRegisteredUser.token}`);

      assert.equal(status, 200, text);
      assert.equal(body.user.email, lastRegisteredUser.email);
    });
  });
});
