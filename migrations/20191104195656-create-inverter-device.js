'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inverterdevices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      siteid: {
        type: Sequelize.INTEGER
      },
      duid: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      userid: {
        type: Sequelize.INTEGER
      },
      voltage: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      charging_current: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat1: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat2: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat3: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat4: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat5: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat6: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat7: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat8: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat9: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat10: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat11: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat12: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat13: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat14: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat15: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      vbat16: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat1: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat2: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat3: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat4: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat5: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat6: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat7: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat8: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat9: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat10: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat11: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat12: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat13: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat14: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat15: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      tbat16: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
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
    return queryInterface.dropTable('inverterdevices');
  }
};