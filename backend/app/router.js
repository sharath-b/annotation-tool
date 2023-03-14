/**
 * @param {Egg.Application} app - egg application
 */
const links = require('./../config/links');

module.exports = app => {
  const { router, controller } = app;

  router.get(links.alive, controller.healthController.alive);
  router.get(links.apiAlive, controller.healthController.alive);

  // documentation
  router.get(links.documentation, controller.documentationController.index);

  // questions
  router.resources(links.questions, controller.questionController);
  router.post(links.questionsCsvUpload, controller.questionController.importCsv);
  // router.get(links.questionsInProject, controller.questionController.questionsInProject);

  // answers
  router.get(links.exportAnswer, controller.answerController.export);
  router.delete(links.answer, controller.answerController.destroy);

  // documents
  router.resources(links.documents, controller.documentController);
  router.get(links.answersInDocument, controller.answerController.index);
  router.post(links.answersInDocument, controller.answerController.create);
  router.delete(links.unlinkDocumentLabeler, controller.documentController.unlinkDocumentLabeler);
  router.post(links.attachDocumentFile, controller.documentController.attachTextfileToDocument);
  router.post(links.documentsCsvUpload, controller.documentController.importCsv);

  // project
  router.get(links.projects, controller.projectController.getProject);
  router.post(links.projects, controller.projectController.createProject);
  router.delete(links.project, controller.projectController.delete);
  router.get(links.documentsInProject, controller.documentController.index);
  router.post(links.documentsInProject, controller.documentController.documentFromFile);

  router.get(links.answersInProject, controller.answerController.getAnswers);
  router.get(links.exportInSquadFormat, controller.answerController.exportInSquadFormat);
  router.get(links.exportInCSVFormat, controller.answerController.exportInCSVFormat);

  // super admin
  router.get(links.superAdmin_organizations, controller.superAdminController.getOrganizations);
  router.get(links.superAdmin_organization, controller.superAdminController.get);
  router.delete(links.superAdmin_organization, controller.superAdminController.delete);
  router.put(links.superAdmin_organization, controller.superAdminController.update);
  router.get(links.superAdmin_usersInOrganization, controller.superAdminController.getUsers);
  router.get(links.superAdmin_projectsInOrganization, controller.superAdminController.getProjects);
  router.get(links.superAdmin_loginAs, controller.superAdminController.loginAs);
  router.get(links.superAdmin_checkSuperAdmin, controller.superAdminController.checkIfSuperAdminAlreadyExist);
  router.post(links.superAdmin_createSuperAdmin, controller.superAdminController.createSuperAdmin);

  // auth
  router.post(links.login, controller.userController.login);
  router.get(links.userInfo, controller.userController.info);

  // organization
  router.get(links.usersInOrganization, controller.organizationController.getUsers);
  router.post(links.addUserToOrganization, controller.userController.addNewUserToOrganization);

  // registration
  router.post(links.registration, controller.userController.registration);
  router.post(links.resetPassword, controller.userController.resetPassword);
};
