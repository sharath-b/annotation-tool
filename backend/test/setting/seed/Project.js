const Base = require('./Base');
const { random, date } = require('faker');

class Project extends Base {
  constructor(app) {
    super(app);
    this.model = app.model.Project;
  }

  createRecord({ organizationId }) {
    return {
      id: random.number(),
      name: random.word(),
      organization_id: organizationId || random.number(),
      created_at: date.past(),
    };
  }
}

module.exports = Project;
