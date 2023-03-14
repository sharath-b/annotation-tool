const Subscription = require('egg').Subscription;

class CreateDefaultUserJob extends Subscription {
  static get schedule() {
    return {
      type: 'worker',

      immediate: true,
    };
  }

  async subscribe() {
    const defaultUser = await this.ctx.service.userService.setupDefaultUser();
    console.log('default user is ready, use: ', defaultUser);
    console.log('-- default password was set in configuration file --');
  }
}

module.exports = CreateDefaultUserJob;
