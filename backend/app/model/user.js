
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    email: STRING,
    first_name: STRING,
    last_name: STRING,
    organization_id: INTEGER,
    password: STRING,
    role: STRING,
    last_login: DATE,
    created_at: DATE,
    updated_at: DATE,
  }, { underscored: true });

  User.associate = () => {
    app.model.User.hasMany(app.model.Document);
    app.model.User.hasMany(app.model.Answer);
  };

  return User;
};

