const { app, assert } = require('egg-mock/bootstrap');
const SeedFactory = require('../../setting/seedFactory');

describe('test/service/userService.test.js', () => {
  let userCredentials;

  before(async () => {
    const { email, authentication } = await SeedFactory.seed('user', 1, { returnInputData: true });
    userCredentials = {
      email,
      password: authentication.passwordPlain,
      passwordHash: authentication.password,
    };
  });

  describe('checkPassword()', () => {
    it('should check password valid', async () => {
      const ctx = app.mockContext();
      const password = userCredentials.password;
      const user = {
        password: userCredentials.passwordHash,
      };
      const passwordValid = await ctx.service.userService.checkPassword(user, password);
      assert(passwordValid);
    });

    it('should check password invalid', async () => {
      const ctx = app.mockContext();
      const password = 'dd2015!12';
      const user = {
        password,
      };
      const passwordValid = await ctx.service.userService.checkPassword(user, password);
      assert(!passwordValid);
    });
  });
});
