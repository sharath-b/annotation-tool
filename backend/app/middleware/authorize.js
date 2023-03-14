// Wrapper for egg-jwt. Without it plugin middlewares executed at the end
module.exports = () => async (ctx, next) => {
  // skip check for root url;
  if (ctx.request.url === '/' || ctx.request.url.indexOf('api') === -1) {
    next();
    return;
  }

  await ctx.app.jwt(ctx, async () => {
    const { user } = ctx.state;
    if (!user) {
      ctx.throw(403, 'JWT token could not be processed');
    }

    const userEntity = await ctx.service.userService.findById(user.id);

    if (!userEntity) {
      ctx.throw(403, 'User not found');
    }

    ctx.state.user = userEntity;

    await next();
  });
};
