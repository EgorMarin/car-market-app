'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'resetPasswordToken', {
      type: Sequelize.STRING,
      defaultValue: null,
    })
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('Users', 'resetPasswordToken')
  }
};
