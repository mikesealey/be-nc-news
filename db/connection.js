const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

const config = {}
const DATABASE_URL = "postgres://burhsavc:scE1VzhsN3DcMWyftn6ZOhCfFo40TWqV@tyke.db.elephantsql.com/burhsavc"

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL
  config.max = 2
}


require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE and DATABASE_URL not set');
}



module.exports = new Pool();
