const { app, assert } = require("egg-mock/bootstrap");
const SeedFactory = require("../../setting/seedFactory");

const fs = require("fs");

describe("test/service/questionService.test.js", () => {
  let user;
  let project;

  before(async () => {
    user = await SeedFactory.seed("user", 1, { returnInputData: true });
    // userWithoutAnyLabels = await SeedFactory.seed('user', 1, { returnInputData: true });
    project = await SeedFactory.seed("project", 1, {
      organizationId: user.organization_id,
    });
  });

  describe("importCSVString()", () => {
    it("Should read CSV File", async () => {
      const ctx = app.mockContext();
      const { questionService } = ctx.service;
      const csvFile = fs.readFileSync(
        __dirname + "/../../sampledata/question_import.csv"
      );
      const result = await questionService.importCSVString(project.id, csvFile);
      assert(result.rowCount === 5);
      // assert(result.errors.length === 2);
    });


  });

});
