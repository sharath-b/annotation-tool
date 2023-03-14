const SeedFactory = require('../../setting/seedFactory');
const { app, assert } = require('egg-mock/bootstrap');
const { loginAndGetToken } = require('./../../helpers');
const links = require('./../../../config/links');
const createLink = require('./../../../core/utils/createLink');
const roles = require('./../../../app/constants/roles');

describe('app/controller/superAdminController', () => {
  let user;
  let organization;

  before(async () => {
    user = await SeedFactory.seed('user', 1, {
      returnInputData: true,
      role: roles.SUPER_ADMIN,
    });

    organization = await SeedFactory.seed('organization', 1);

    const token = await loginAndGetToken(app, {
      email: user.email,
      password: user.authentication.passwordPlain,
    });

    user.token = token;
  });

  describe(`GET ${links.superAdmin_organizations}`, () => {
    it('should get all organizations', async () => {
      const { body } = await app.httpRequest()
        .get(links.superAdmin_organizations)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      assert(Array.isArray(body));
    });
  });

  describe(`GET ${links.superAdmin_organization}`, () => {
    it('should get an organization', async () => {
      const { body } = await app.httpRequest()
        .get(createLink(links.superAdmin_organization, { id: organization.id }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      assert.equal(body.organization.id, organization.id);
    });

    it('should get validation error', async () => (
      await app.httpRequest()
        .get(createLink(links.superAdmin_organization, { id: 'notId' }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(422)
    ));
  });

  describe(`PUT ${links.superAdmin_organization}`, () => {
    it('should update an organization', async () => {
      const newOrganizationName = 'Organization name';
      const { body } = await app.httpRequest()
        .put(createLink(links.superAdmin_organization, { id: organization.id }))
        .set('Authorization', `Bearer ${user.token}`)
        .send({ name: newOrganizationName })
        .expect(200);

      assert.equal(body.editedOrganization.name, newOrganizationName);
    });

    it('should get validation error', async () => (
      await app.httpRequest()
        .put(createLink(links.superAdmin_organization, { id: organization.id }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(422)
    ));
  });

  describe(`DELETE ${links.superAdmin_organization}`, () => {
    it('should delete an organization', async () => {
      const { body } = await app.httpRequest()
        .delete(createLink(links.superAdmin_organization, { id: organization.id }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      assert.equal(body.deletedOrganization, organization.id);
    });

    it('should get validation error', async () => (
      await app.httpRequest()
        .delete(createLink(links.superAdmin_organization, { id: 'notId' }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(422)
    ));
  });

  describe(`GET ${links.superAdmin_usersInOrganization}`, () => {
    it('should get all users in an organization', async () => {
      const { body } = await app.httpRequest()
        .get(createLink(links.superAdmin_usersInOrganization, { id: organization.id }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      assert(Array.isArray(body));
    });

    it('should get validation error', async () => (
      await app.httpRequest()
        .delete(createLink(links.superAdmin_organization, { id: 'notId' }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(422)
    ));
  });

  describe(`GET ${links.superAdmin_projectsInOrganization}`, () => {
    it('should get all projects in an organization', async () => {
      const { body } = await app.httpRequest()
        .get(createLink(links.superAdmin_projectsInOrganization, { id: organization.id }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      assert(Array.isArray(body));
    });

    it('should get validation error', async () => (
      await app.httpRequest()
        .get(createLink(links.superAdmin_projectsInOrganization, { id: 'notId' }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(422)
    ));
  });

  describe(`GET ${links.superAdmin_loginAs}`, () => {
    it('should get token and user\'s information', async () => {
      const { body } = await app.httpRequest()
        .get(createLink(links.superAdmin_loginAs, { id: user.id }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      // assert.equal(body.token, user.token);
    });

    it('should get validation error', async () => (
      await app.httpRequest()
        .get(createLink(links.superAdmin_loginAs, { id: 'notId' }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(422)
    ));

    it('should get an error (404, User not found.)', async () => (
      await app.httpRequest()
        .get(createLink(links.superAdmin_loginAs, { id: 999999 }))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404)
    ));
  });
});
