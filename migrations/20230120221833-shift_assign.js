'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Assigneds', 'shiftId', {
        type:Sequelize.INTEGER,
        references:{
          model:'Shifts',
          id:'id'
        }
      }),
      queryInterface.addColumn('Assigneds', 'carerId', {
        type:Sequelize.INTEGER,
        references:{
          model:'Carers',
          key:'id'
        }
      })
    ])
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
