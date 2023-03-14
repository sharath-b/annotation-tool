const bcrypt = require('bcryptjs');
const password = process.argv[2];
const saltRounds = 3;

console.log({ password });

const hash = bcrypt.hashSync(password, saltRounds);

console.log({ hash });
