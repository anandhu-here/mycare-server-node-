'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Timesheets', 'signId', {
        type:Sequelize.INTEGER,
        references:{
          model:'Signatures',
          key:'id'
        },
        onDelete:"cascade"
      }),
      queryInterface.addColumn('Signatures', 'authId', {
        type:Sequelize.INTEGER,
        references:{
          model:'HomeAuths',
          key:'id'
        },
        onDelete:"cascade"
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
