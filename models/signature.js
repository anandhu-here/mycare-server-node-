'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Signature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Signature.belongsTo(models.HomeAuth, {
        as:'auth',
        foreignKey:{
          name:"authId"
        }
      })
      Signature.hasMany(models.Timesheet, {
        as:'timesheet',
        foreignKey:{
          name:"signId"
        }
      })
    }
  }
  Signature.init({
    sign: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Signature',
  });
  return Signature;
};