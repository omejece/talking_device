'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('phcndevices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      siteid: {
        type: Sequelize.INTEGER
      },
      userid: {
        type: Sequelize.INTEGER
      },
      source_type: {
        type: Sequelize.INTEGER
      },
      source_uid: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      duid: {
        type: Sequelize.STRING
      },
      powerstatus: {
        type: Sequelize.DOUBLE(10,2)
      },
      control: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('phcndevices');
  }
};