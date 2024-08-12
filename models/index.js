'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config'); 
const env = process.env.NODE_ENV || 'development';
const configEnv = config[env];
const sequelize = new Sequelize(configEnv.database, configEnv.username, configEnv.password, {
  host: configEnv.host,
  dialect: configEnv.dialect,
  logging: false,
});

const db = {};

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
