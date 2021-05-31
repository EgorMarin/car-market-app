'use strict';
const { Ad } = require('../models')

const { VEHICLE_TYPE } = require('../config/constanst');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Ad.create({
      modelId: 2,
      userId: 1,
      vehicleType: VEHICLE_TYPE.AUTO,
      price: 10000,
      year: '2008',
      vin: 'WVWBP7ANXDE543887',
      description: 'My supercar. Price is good, for contant call me or write into direct.',
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ads', null, {});
  }
};
