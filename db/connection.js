const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL = "postgres://burhsavc:scE1VzhsN3DcMWyftn6ZOhCfFo40TWqV@tyke.db.elephantsql.com/burhsavc"

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});
const config = {}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE and DATABASE_URL not set');
}

if (ENV === "development") {
  config.connectionString = process.env.DATABASE_URL
  config.max = 2
}







module.exports = new Pool();
