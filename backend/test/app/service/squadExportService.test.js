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

  describe("getDataInSquadFormatToExport()", () => {
    it("Should return squad format data in json", async () => {
      const ctx = app.mockContext();
      const squadExportService = ctx.service.exports.squadExportService;

      const dataInSquadFormat = await squadExportService.getDataInSquadFormatToExport(
        project.id
      );


      const paragraphs = dataInSquadFormat[0].paragraphs;

      const qas = paragraphs[0].qas;
      assert(qas.length === 1);
      assert(typeof qas[0].question === "string");
    });

    it("should not show any NOT_UNDERSTOOD answer", async () => {
      const ctx = app.mockContext();
      const squadExportService = ctx.service.exports.squadExportService;
      await SeedFactory.seed("answer", 1, {
        userId: user.id,
        documentId: document.id,
        questionId: questions[0].id,
        answer_category: AnswerCategories.NOT_UNDERSTOOD,
      });
      const documents = await squadExportService.getDataInSquadFormatToExport(
        project.id
      );

      for (let document of documents) {
        for (let paragraph of document.paragraphs) {
          if (paragraph.document_id === document.id) {
            // corrrect document, should not find not understood answer
            const notUnderstoodAnwer = _.find(
              paragraph.answers,
              answer.answer_category === AnswerCategories.NOT_UNDERSTOOD
            );
            assert(notUnderstoodAnwer === undefined);
          }
        }
      }
    });

    it("should not show NOT_GIVEN, but make it is_impossible answer", async () => {

      ///
      /// Behaviour to test:
      /// 1) NOT_GIVEN answer is set on a question / document combination (answer)
      /// 2) The answer should not be shown in the paragraph
      /// 3) the paragraph should have is_impossible = true
      ///
      ///

      const ctx = app.mockContext();
      const squadExportService = ctx.service.exports.squadExportService;
      const documentWithNotGivenAnswer = await SeedFactory.seed("document", 1, {
        userId: user.id,
        projectId: project.id,
      });

      const question = await SeedFactory.seed("question", 1, {
        documentId: documentWithNotGivenAnswer.id,
        projectId: project.id,
      });
      const rel = await SeedFactory.seed("answer", 1, {
        userId: user.id,
        documentId: documentWithNotGivenAnswer.id,
        questionId: question.id,
        answer_category: AnswerCategories.NOT_GIVEN,
      });
      const documents = await squadExportService.getDataInSquadFormatToExport(
        project.id
      );

      for (let document of documents) {
        for (let paragraph of document.paragraphs) {
          if (paragraph.document_id === documentWithNotGivenAnswer.id) {
            // corrrect document, should not find not understood answer
            const notGivenAnswer = _.find(
              paragraph.answers,
              answer.answer_category === AnswerCategories.NOT_GIVEN
            );
            assert(paragraph.qas[0].is_impossible === true);
            assert(paragraph.qas[0].answers.length === 0);
            assert(notGivenAnswer === undefined);
          }
        }
      }
    });
    it("should not show a document with no answer", async () => {
      const ctx = app.mockContext();
      const squadExportService = ctx.service.exports.squadExportService;
      const documents = await squadExportService.getDataInSquadFormatToExport(
        project.id
      );

      const foundWithoutAnswers = _.find(documents, (document) =>
        _.find(
          document.paragraphs,
          (paragraphs) => paragraphs.document_id === documentWithoutanswers.id
        )
      );

      assert(foundWithoutAnswers === undefined); // document without answers should not be part of the Squad file.
    });

    it("should map only correct questions to answers", async () => {
      // this was a bug described here: https://www.notion.so/ec4f6832b1b04f89b0db7eea369e263b?v=62694f03ec314d6aa2a174c8e7de6e25&p=29f28620f9614efe9948bfb9aed83f09

      const ctx = app.mockContext();
      const squadExportService = ctx.service.exports.squadExportService;

      const documents = await squadExportService.getDataInSquadFormatToExport(
        project.id
      );

      for (let document of documents) {
        for (let paragraphs of document.paragraphs) {
          for (let question of paragraphs.qas) {
            assert(answer.length === 5);
            for (let answer of question.answers) {
              assert(question.id === answer.question_id);
            }
          }
        }
      }
    });

    it("Should return squad format data in json", async () => {
      const ctx = app.mockContext();
      const squadExportService = ctx.service.exports.squadExportService;

      const dataInSquadFormat = await squadExportService.getDataInSquadFormatToExport(
        project.id
      );
      const paragraphs = dataInSquadFormat[0].paragraphs;
      const qas = paragraphs[0].qas;

      assert(qas.length === 1);
      assert(typeof qas[0].question === "string");
    });

    it("Should return squad format data in json without any data", async () => {
      const ctx = app.mockContext();
      const squadExportService = ctx.service.exports.squadExportService;
      const dataInSquadFormat = await squadExportService.getDataInSquadFormatToExport(
        projectWithoutAnyDocument.id
      );

      assert.ok(dataInSquadFormat.length === 0);
    });
  });
});
