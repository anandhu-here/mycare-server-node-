'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('Carers', 'firstName', {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.changeColumn('Carers', 'lastName', {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.changeColumn('Carers', 'postcode', {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.changeColumn('Carers', 'adress1', {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.changeColumn('Carers', 'city', {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.changeColumn('Carers', 'dob', {
        type: Sequelize.STRING,
        allowNull:true
      }),
      queryInterface.changeColumn('Carers', 'phone', {
        type: Sequelize.STRING,
        allowNull:true
      }),
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
