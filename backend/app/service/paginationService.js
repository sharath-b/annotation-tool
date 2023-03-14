const Service = require('egg').Service;
const { defaults } = require('lodash');

class PaginationService extends Service {
  constructor(...args) {
    super(...args);
    this.options = {
      limit: 30,
      offset: 0,
    };
  }

  async findAll(model, query = {}, paginationOptions = {}, attributes) {

    const options = defaults(paginationOptions, this.options);

    options.where = query;

    options.attributes = attributes;
    const response = await model.findAndCountAll(options);
    const pagination = {
      limit: parseInt(options.limit),
      offset: parseInt(options.offset),
      count: parseInt(response.count),
      query,
    };
    return {
      entries: response.rows,
      pagination,
    };
  }
}

module.exports = PaginationService;
