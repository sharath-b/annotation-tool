const { Client } = require('pg');
const fs = require('fs');


async function generateDocs() {

  const config = {
    dialect: 'postgres',
    database: 'deepannotate',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres', // psql -d template1 -c "ALTER USER deepannotate WITH PASSWORD 'deepannotate\!';"
    password: 'deepannotate',

    // database: 'deepannotate_prod',
  };
  const client = new Client(config);

  await client.connect();
  const res = await client.query('SELECT id, text FROM documents');

  for (const doc of res.rows) {

    const text = doc.text.replace(/\r\n/g, '\n')
      .replace(/<(.*)>/g, '$1')
      .replace(/</g, '');
    fs.writeFileSync('./tmp/' + doc.id + '.txt', text);
  }
  await client.end();

  console.log('done');

}

generateDocs();
