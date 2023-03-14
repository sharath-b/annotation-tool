const Controller = require('egg').Controller;

class BaseController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.model = null;
    this.name = 'Resource';
    this.allowedQuery = null;
  }

  get user() {
    return this.ctx.session.user;
  }

  success(data) {
    this.ctx.body = data || { success: true };
  }

  validate(rule, data) {
    const actualData = data || this.ctx.request.body;

    return this.ctx.validate(rule, actualData);
  }

  notFound(instanceName) {
    this.ctx.throw(404, `${instanceName} not found`);
  }

  badRequest(message = 'Invalid request') {
    this.ctx.throw(400, message);
  }

  forbidden(message = 'Forbidden') {
    this.ctx.throw(403, message);
  }

  async index() {
    // const { service } = this;
    // // const { criteria, options } = this.checkAndBuildMongoQuery(this.ctx.query);
    // // const page = await service.paginationService.findAll(this.model, criteria, options);
    // const page = {}; // @todo
    // const transformedPage = await this.transformPage(page);
    // return this.success(transformedPage);
    // moved to api controller
  }

  async show() {
    // const { ctx } = this;
    // const record = {} ; // await this.model.findOne({ _id: ctx.params.id });
    // if (!record) {
    //   return this.notFound(this.name);
    // }
    //
    // this.success(await this.transformEntry(record));
    // moved to api controller
  }


}

module.exports = BaseController;
