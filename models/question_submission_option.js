'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question_Submission_Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Question_Submission_Option.init({
    question_id: DataTypes.INTEGER,
    option_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    preferred: DataTypes.STRING,
    chosen: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question_Submission_Option',
  });
  return Question_Submission_Option;
};