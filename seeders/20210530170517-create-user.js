'use strict';
const { User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return User.create({
      email: 'daggle603@gmail.com',
      password: '18Lavufo',
      fullName: 'Egor Marin',
      phone: '380954912378',
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
