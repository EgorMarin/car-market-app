'use strict';

const { VEHICLE_TYPE } = require("../config/constanst");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Vehicles', 'type', {
      type: Sequelize.STRING,
      validate: {
        isIn: {
          args: [[
            VEHICLE_TYPE.AUTO, 
            VEHICLE_TYPE.MOTO, 
            VEHICLE_TYPE.BUS, 
            VEHICLE_TYPE.TRUCK, 
            VEHICLE_TYPE.WATER, 
            VEHICLE_TYPE.AIR
          ]],
          msg: "Type is invalid!"
        }
      }
    })

    await queryInterface.addColumn('Vehicles', 'price', {
      type: Sequelize.INTEGER,
      validate: {
        min: 0,
      }
    })

    await queryInterface.addColumn('Vehicles', 'age', {
      type: Sequelize.INTEGER,
      validate: {
        min: 0,
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Vehicles', 'type')
    await queryInterface.removeColumn('Vehicles', 'price')
    await queryInterface.removeColumn('Vehicles', 'age')
  }
};
