const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const models = Object.assign(
  {}, 
  ...fs
  .readdirSync(__dirname)
  .filter(fileName => fileName.indexOf('.') !== 0 && fileName !== 'index.js')
  .map(fileName => {
    const model = require(path.join(__dirname, fileName))(sequelize, Sequelize.DataTypes)
    return {
      [model.name]: model
    }
  })
)

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
})

module.exports = models