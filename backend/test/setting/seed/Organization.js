const Base = require('./Base');
const {
  random,
  date,
  company,
} = require('faker');

class Organization extends Base {
  constructor(app) {
    super(app);
    this.model = app.model.Organization;
  }

  createRecord() {
    return {
      id: random.number(10000),
      name: company.companyName(),
      created_at: date.past(),
    };
  }
}

module.exports = Organization;
