const { BaseController } = require('./base');
// const { contentQueryValidation } = require('../validation/query');

class ContentsController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Content;
    this.name = 'Content';
    // this.allowedQuery = contentQueryValidation;
  }
}

module.exports = ContentsController;
