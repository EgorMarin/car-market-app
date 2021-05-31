'use strict';
const { Brand } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const brands = [{ name: 'BMW' }, { name: 'Mercedes-Benz' }, { name: 'Toyota' }, { name: 'Lada' }]

    return Promise.all(
      brands.map((brand) => {
        return Brand.create(brand)
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Brands', null, {});
  }
};
