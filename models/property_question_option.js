'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property_Question_Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Property_Question_Option.belongsTo(models.Property,{
      //   foreignKey:'property_id',
      //   onDelete:'CASCADE'
      // })

      // Property_Question_Option.belongsTo(models.Question_Options,{
      //   foreignKey:'option_id',
      //   onDelete:'CASCADE'
      // })

      // Property_Question_Option.belongsTo(models.Property_Question,{
      //   foreignKey:'property_question_id',
      //   onDelete:'CASCADE'
      // })
    }
  }
  Property_Question_Option.init({
    property_id: DataTypes.INTEGER,
    property_question_id: DataTypes.INTEGER,
    option_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    preferred: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Property_Question_Option',
  });
  return Property_Question_Option;
};