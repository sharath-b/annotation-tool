const { app, assert } = require("egg-mock/bootstrap");
const SeedFactory = require("../../setting/seedFactory");

const fs = require("fs");

describe("test/service/documentService.test.js", () => {
  let user;
  let project;
  let document;
  let projectWithoutAnyDocument;
  let questions;
  let answer;
  let userWithoutAnyLabels;

  before(async () => {
    user = await SeedFactory.seed("user", 1, { returnInputData: true });
    project = await SeedFactory.seed("project", 1, {
      organizationId: user.organization_id,
    });
  });

  describe("createNewDocument()", () => {
    it("should create a new docuemnt", async () => {
      const ctx = app.mockContext();
      const { documentService } = ctx.service;
      const sampleText = "hello world";
      const doc = {
        text: sampleText,
      };
      const newDoc = await documentService.createNewDocument(
        project.id,
        user.id,
        doc
      );
      assert(newDoc.text === sampleText);
    });
    it("should update existing doc with same text", async () => {
      const ctx = app.mockContext();
      const { documentService } = ctx.service;
      const sampleText = "hello world" + Math.random() * 10000;
      const doc = {
        text: sampleText,
      };

      const newDoc = await documentService.createNewDocument(
        project.id,
        user.id,
        doc
      );
      assert(newDoc.text === sampleText);
      // assert(newDoc.isNewRecord === true);

      const sameDoc = await documentService.createNewDocument(
        project.id,
        user.id,
        doc
      );
      assert(sameDoc.text === sampleText);
      assert(sameDoc.isNewRecord === false);
    });
  });
  describe("importCSVString()", () => {
    it("Should read CSV File", async () => {
      const ctx = app.mockContext();
      const { documentService } = ctx.service;
      const csvFile = fs.readFileSync(
        __dirname + "/../../sampledata/document_import.csv"
      );
      const result = await documentService.importCSVString(
        project.id,
        user.id,
        csvFile
      );
      assert(result.rowCount === 7);
      // assert(result.errors.length === 3);
    });
  });
});
