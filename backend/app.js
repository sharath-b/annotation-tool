const validate = require('koa-validate');

class AppBootHook {
  constructor(app) {
    this.app = app;
    // logger.disable('file');
    console.log('** API Booting **');
    validate(app);
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
    console.log('** API Ready **');
  }

  async serverDidReady() {
    // Server is listening.

  }

  async beforeClose() {
    // Do some thing before app close.
  }
}

module.exports = AppBootHook;
