require('dotenv').config();
const { DATABASE, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST } = process.env;

module.exports = {
  development: {
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE,
    host: DATABASE_HOST,
    dialect: 'mysql'
  },
  test: {
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE,
    host: DATABASE_HOST,
    dialect: 'mysql'
  },
  production: {
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE,
    host: DATABASE_HOST,
    dialect: 'mysql'
  }
};
