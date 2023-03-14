const Base = require("./Base");
const { random, date, lorem } = require("faker");

class Document extends Base {
  constructor(app) {
    super(app);
    this.model = app.model.Document;
  }

  createRecord({ organizationId, userId, projectId }) {
    return {
      id: random.number(),
      text: "hello" + lorem.text(),
      status: "new",
      project_id: projectId || random.number(),
      order: random.number(),
      user_id: userId,
    };
  }
}

module.exports = Document;
