const { app } = require('egg-mock/bootstrap');
const { User, Project, Organization, Document, Answer, Question } = require('./seed');

class SeedFactory {
  static seed(entity, ...args) {
    console.log('seding', entity);
    switch (entity) {
      case 'user':
        return (new User(app)).seed(...args);
      case 'project':
        return (new Project(app)).seed(...args);
      case 'organization':
        return (new Organization(app)).seed(...args);
      case 'document':
        return (new Document(app)).seed(...args);
      case 'question':
        return (new Question(app)).seed(...args);
      case 'answer':
        return (new Answer(app)).seed(...args);
      default:
        throw new Error(`'Unsupported entity ${entity}`);
    }
  }
}

module.exports = SeedFactory;
