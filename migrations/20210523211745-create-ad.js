'use strict';

const { VEHICLE_TYPE } = require("../config/constanst");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Ads', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      modelId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Models',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'no action',
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'no action',
      },
      vehicleType: {
        type: Sequelize.STRING,
        defaultValue: VEHICLE_TYPE.AUTO,
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
            msg: "Type is invalid!",
          },
        },
      },
      price: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
        },
      },
      year: Sequelize.STRING,
      vin: {
        type: Sequelize.STRING,
        validate: {
          len: {
            args: [17],
            msg: 'Vin code must be 17 numbers'
          }
        },
      },
      description: {
        type: Sequelize.STRING,
        validate: {
          min: 20,
          max: 2000,
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('Ads');
  }
};
