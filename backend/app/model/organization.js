module.exports = app => {
  const { STRING, DATE } = app.Sequelize;

  const Organization = app.model.define('organization', {
    name: STRING,
    created_at: DATE,
    updated_at: DATE,
  }, { underscored: true });

  Organization.associate = () => {
    app.model.Organization.hasMany(app.model.User, {
      onDelete: 'cascade',
      hooks: true,
    });

    app.model.Organization.hasMany(app.model.Project, {
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return Organization;
};
