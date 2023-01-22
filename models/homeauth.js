'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HomeAuth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HomeAuth.hasMany(models.Signature, {
        as:'sign',
        foreignKey:{
          name:"authId"
        },
        onDelete:"CASCADE"
      })
    }
  }
  HomeAuth.init({
    authName: DataTypes.STRING,
    authPos: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HomeAuth',
  });
  return HomeAuth;
};