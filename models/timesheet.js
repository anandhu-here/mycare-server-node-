'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Timesheet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Timesheet.belongsTo(models.Carer, {
        as:'carer',
        foreignKey:{
          name:'carerId'
        }
      })
      Timesheet.belongsTo(models.Signature, {
        as:'sign',
        foreignKey:{
          name:'signId'
        }
      })
      Timesheet.belongsTo(models.Shift, {
        as:'shift',
        foreignKey:{
          name:'shiftId'
        }
      })
    }
  }
  Timesheet.init({
    type: DataTypes.STRING,
    authName: DataTypes.STRING,
    authPos: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Timesheet',
  });
  return Timesheet;
};