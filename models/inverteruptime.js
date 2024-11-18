'use strict';
module.exports = (sequelize, DataTypes) => {
  const inverteruptime = sequelize.define('inverteruptime', {
    duid: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    siteid: DataTypes.INTEGER,
    duration: DataTypes.DOUBLE,
    datetaken: DataTypes.DATE
  }, {});
  inverteruptime.associate = function(models) {
  };
  return inverteruptime;
};