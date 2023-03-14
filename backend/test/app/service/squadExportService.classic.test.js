const { app, assert } = require("egg-mock/bootstrap");
const SeedFactory = require("../../setting/seedFactory");
const { AnswerCategories } = require("../../../app/enums/answerCategories");
const _ = require("lodash");

describe("test/service/export/squadExportService.test.js", () => {
  let user;
  let project;
  let document, documentWithoutanswers;
  let projectWithoutAnyDocument;
  let questions;
  let answer;
  let userWithoutAnyLabels;

  before(async () => {
    user = await SeedFactory.seed("user", 1, { returnInputData: true });
    userWithoutAnyLabels = await SeedFactory.seed("user", 1, {
      returnInputData: true,
    });
    project = await SeedFactory.seed("project", 1, {
      organizationId: user.organization_id,
    });
    projectWithoutAnyDocument = await SeedFactory.seed("project", 1, {
      organizationId: user.organization_id,
    });
    document = await SeedFactory.seed("document", 1, {
      userId: user.id,
      projectId: project.id,
    });
    documentWithoutanswers = await SeedFactory.seed("document", 1, {
      userId: user.id,
      projectId: project.id,
    });
    questions = await SeedFactory.seed("question", 5, {
      documentId: document.id,
      projectId: project.id,
    });
    answer = await SeedFactory.seed("answer", 5, {
      userId: user.id,
      documentId: document.id,
      questionId: questions[0].id,
    });
  });

  describe("getDataInSquadFormatToExport() for defaultProjects", () => {
    it("should export answers from classic proejct" , async () => {

      const ctx = app.mockContext();
      const squadExportService = ctx.service.exports.squadExportService;

      const dataInSquadFormat = await squadExportService.getDataInSquadFormatToExport(
        project.id
      );

    })
  });
});
