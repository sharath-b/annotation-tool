const Controller = require('egg').Controller;

class DocumentationController extends Controller {

  async index() {
    const { config, ctx } = this;
    await ctx.render('documentation', { assetsPath: config.static.prefix });
  }
}

module.exports = DocumentationController;
