'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property_Applicant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property_Applicant.belongsTo(models.Property,{
        foreignKey:"property_id",
        onDelete:"CASCADE"
      })
      Property_Applicant.belongsTo(models.Image,{
        foreignKey:"image_id",
        onDelete:"CASCADE",
        constraints:false
      })
    }
  }
  Property_Applicant.init({
    property_id: DataTypes.INTEGER,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    move_in_date: DataTypes.DATE,
    remarks: DataTypes.STRING,
    image_id: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    archive:{ type:DataTypes.INTEGER,defaultValue:0}
  }, {
    sequelize,
    modelName: 'Property_Applicant',
  });
  return Property_Applicant;
};