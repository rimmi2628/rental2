'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property_Question_Submission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    Property_Question_Submission.belongsToMany(models. Question_Options,{
      foreignKey:"question_id",
      through:"Question_Submission_Option",
      onDelete:"CASCADE"
    })
    }
  }
  Property_Question_Submission.init({
    property_applicant_id: DataTypes.INTEGER,
    property_question_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    has_other: DataTypes.INTEGER,
    match: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Property_Question_Submission',
  });
  return Property_Question_Submission;
};