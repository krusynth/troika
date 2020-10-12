'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('rooms', 'status', {type: Sequelize.JSONB});
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('rooms', 'status');
  }
};
