'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('gendevices', {
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
      gendeviceid: {
        type: Sequelize.INTEGER
      },
      sensortype: {
        type: Sequelize.INTEGER
      },
      is_linked: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      duid: {
        type: Sequelize.STRING
      },
      gauge: {
        type: Sequelize.DOUBLE(10,2)
      },
      gauge2: {
        type: Sequelize.DOUBLE(10,2)
      },
      clearance: {
        type: Sequelize.DOUBLE(10,2)
      },
      flowrate: {
        type: Sequelize.DOUBLE(10,2)
      },
      control: {
        type: Sequelize.INTEGER
      },
      frequency: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue:0
      },
      voltage: {
        type: Sequelize.DOUBLE(10,2),
        defaultValue:0
      },
      voltagea: {
        type: Sequelize.DOUBLE(10,2),
        defaultValue:0
      },
      voltageb: {
        type: Sequelize.DOUBLE(10,2),
        defaultValue:0
      },
      voltagec: {
        type: Sequelize.DOUBLE(10,2),
        defaultValue:0
      },
      currenta: {
        type: Sequelize.DOUBLE(10,2),
        defaultValue:0
      },
      currentb: {
        type: Sequelize.DOUBLE(10,2),
        defaultValue:0
      },
      currentc: {
        type: Sequelize.DOUBLE(10,2),
        defaultValue:0
      },
      power_factor: {
        type: Sequelize.DOUBLE(10,2),
        defaultValue:0
      },
      active_power: {
        type: Sequelize.DOUBLE(10,2),
        defaultValue:0
      },
      reactive_power: {
        type: Sequelize.DOUBLE(10,2),
        defaultValue:0
      },
      avar: {
        type: Sequelize.DOUBLE(40,20)
      },
      cvar: {
        type: Sequelize.DOUBLE(40,20)
      },
      tankheight: {
        type: Sequelize.DOUBLE(10,2)
      },
      longitude:{
         type: Sequelize.DOUBLE(20,15),
         allowNull: true
      },
      latitude:{
        type: Sequelize.DOUBLE(20,15),
        allowNull: true
      },
      status: {
        type: Sequelize.INTEGER
      },
      gpstimestamp: {
        allowNull: false,
        type: Sequelize.DATE
      },
      lastupdated: {
        allowNull: false,
        type: Sequelize.DATE
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
    return queryInterface.dropTable('gendevices');
  }
};