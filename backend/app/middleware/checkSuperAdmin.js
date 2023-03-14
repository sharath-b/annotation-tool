const roles = require('./../constants/roles');

module.exports = () => {
  return async (ctx, next) => {
    const { role } = ctx.state.user;

    if (role !== roles.SUPER_ADMIN) {
      ctx.throw(403, 'Access denied.');
    }

    await next();
  };
};
