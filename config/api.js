const express = require('express')
const morganLogger = require('morgan');
const cors = require('cors');

module.exports = (app) => {
  app.use(morganLogger('dev'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static('public'));
  app.use(cors());
}