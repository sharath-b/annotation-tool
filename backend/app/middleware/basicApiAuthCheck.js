const auth = require('basic-auth');

module.exports = () => {
  return async function basicApiAuthCheck(ctx, next) {
    const { request } = ctx;
    const authHeader = request.get('Authorization');
    const credentials = auth.parse(authHeader);

    // hack @sasha, please remove and put url to ignore.
    // if ()

    if (!credentials) {
      ctx.throw(403, 'Authorization header is missing');
    }

    const user = await ctx.service.userService.login(credentials.name, credentials.pass, { basic: true });
    if (!user.globalRights.service) {
      ctx.throw(401, 'Unauthorized');
    }
    ctx.state.user = user;
    await next();
  };
};
