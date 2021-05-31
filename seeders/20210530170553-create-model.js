'use strict';
const { Model } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const models = [
      { brandId: 1 ,name: 'M3' }, 
      { brandId: 1 ,name: 'X5' },
      { brandId: 2 ,name: 'G63' },
      { brandId: 2 ,name: 'A200' },
      { brandId: 3 ,name: 'RAV4' },
      { brandId: 4 ,name: '2107' },
    ]

    return Promise.all(
      models.map((model) => {
        return Model.create(model)
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Models', null, {});
  }
};
