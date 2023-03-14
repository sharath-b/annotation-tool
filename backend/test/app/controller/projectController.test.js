const SeedFactory = require("../../setting/seedFactory");
const { app, assert } = require("egg-mock/bootstrap");
const { loginAndGetToken } = require("./../../helpers");
const links = require("./../../../config/links");
const createLink = require("./../../../core/utils/createLink");

describe("app/controller/projectController", () => {
  let project;
  let token;

  before(async () => {
    const userData = await SeedFactory.seed("user", 1, {
      returnInputData: true,
    });
    const userPassword = userData.authentication.passwordPlain;
    project = await SeedFactory.seed("project", 1, {
      organizationId: userData.organization_id,
    });
    let document = await SeedFactory.seed("document", 1, {
      projectId: project.id,
    });

    token = await loginAndGetToken(app, {
      email: userData.email,
      password: userPassword,
    });
  });

  describe("GET api/projects", () => {
    it("should return an array of projects for organization", async () =>
      await app
        .httpRequest()
        .get(links.projects)
        .set("Authorization", `Bearer ${token}`)
        .expect(200));
  });

  describe("POST /api/projects", () => {
    const newProjectName = "My new project" + (Math.random() * 1000);
    it("should create a new project", async () => {
      const { body, status,text } = await app
        .httpRequest()
        .post(links.projects)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: newProjectName, annotation_mode:'DEFAULT' });
      assert.equal(status, 200, text);
      assert.equal(body.name, newProjectName);
    });

    it('should return: "Validation error"', async () =>
      await app
        .httpRequest()
        .post(links.projects)
        .set("Authorization", `Bearer ${token}`)
        .expect(422));

    it('should return: "Project name already exist."', async () =>
      await app
        .httpRequest()
        .post(links.projects)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: newProjectName, annotation_mode:'DEFAULT' })
        .expect(409));
  });

  describe("GET /api/projects/:id/documents", () => {
    it("should return all documents in project", async () => {
      const { body } = await app
        .httpRequest()
        .get(createLink(links.documentsInProject, { id: project.id }))
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      assert(Array.isArray(body.entries));
    });

    it("should return work with limit documents project", async () => {
      const { body } = await app
        .httpRequest()
        .get(createLink(links.documentsInProject, { id: project.id }))
        .query({ limit: 10 })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      assert(Array.isArray(body.entries));
    });

    it("should not find any documents wiht large offset", async () => {
      const { body } = await app
        .httpRequest()
        .get(createLink(links.documentsInProject, { id: project.id }))
        .query({ offset: 99999999 })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      assert(Array.isArray(body.entries));
      assert(body.entries.length === 0);
    });

    it("should  find a documents with 0 offset", async () => {
      const { body } = await app
        .httpRequest()
        .get(createLink(links.documentsInProject, { id: project.id }))
        .query({ offset: 0 })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      assert(Array.isArray(body.entries));
      assert(body.entries.length > 0);
    });

    it('should return: "Access denied."', () =>
      app
        .httpRequest()
        .get(createLink(links.documentsInProject, { id: "99999" }))
        .set("Authorization", `Bearer ${token}`)
        .expect(403));
  });

  describe(`GET ${links.answersInProject}`, () => {
    it("should get all answers in project", async () => {
      const { body } = await app
        .httpRequest()
        .get(createLink(links.answersInProject, { id: project.id }))
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      assert(Array.isArray(body));
    });

    it('should return: "Access denied."', () =>
      app
        .httpRequest()
        .get(createLink(links.answersInProject, { id: "99999" }))
        .set("Authorization", `Bearer ${token}`)
        .expect(403));
  });

  describe("DELETE api/projects/:id", () => {
    it("should delete project by id and return id of project", async () => {
      const { body } = await app
        .httpRequest()
        .delete(createLink(links.project, { id: project.id }))
        .set("Authorization", `Bearer ${token}`);

      assert.equal(body.id, project.id);
    });

    it('should return message: "Project not found."', async () =>
      await app
        .httpRequest()
        .delete(createLink(links.project, { id: "99999" }))
        .set("Authorization", `Bearer ${token}`)
        .expect(403));
  });
});
