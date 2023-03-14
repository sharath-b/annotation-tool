const superAdminPrefix = '/api/superadmin';

module.exports = {
  // registration
  registration: '/api/user/registration',
  resetPassword: '/api/user/:id/reset_password',

  // organization
  usersInOrganization: '/api/organization/users',
  addUserToOrganization: '/api/organization/user',

  // auth
  login: '/api/user/login',
  userInfo: '/api/user/info',
  apiInit: '/api/init',

  // super admin
  superAdminPrefix,
  superAdmin_organizations: `${superAdminPrefix}/organizations`,
  superAdmin_organization: `${superAdminPrefix}/organizations/:id`,
  superAdmin_usersInOrganization: `${superAdminPrefix}/organizations/:id/users`,
  superAdmin_projectsInOrganization: `${superAdminPrefix}/organizations/:id/projects`,
  superAdmin_loginAs: `${superAdminPrefix}/loginAs/:id`,
  superAdmin_checkSuperAdmin: '/api/checkSuperAdmin',
  superAdmin_createSuperAdmin: '/api/createSuperAdmin',

  // project
  projects: '/api/projects',
  project: '/api/projects/:id',
  documentsInProject: '/api/projects/:id/documents',
  questionsInProject: '/api/projects/:id/questions',
  answersInProject: '/api/projects/:id/answers',
  exportInSquadFormat: '/api/projects/:id/export/squad',
  exportInCSVFormat: '/api/projects/:id/export/csv',

  // documents
  documents: '/api/documents',
  attachDocumentFile: '/api/documents/:id/attachfile',
  answersInDocument: '/api/documents/:id/answers',
  unlinkDocumentLabeler: '/api/documents/:id/labeler',
  documentsCsvUpload: '/api/documents/csvupload',

  // questions
  questions: '/api/questions',
  questionsCsvUpload: '/api/questions/csvupload',

  // answers
  answer: '/api/answers/:id',
  exportAnswer: '/api/export',

  // documentation
  documentation: '/api/documentation',

  // health
  alive: '/alive',
  apiAlive: '/api/alive',

  home: '/',
};
