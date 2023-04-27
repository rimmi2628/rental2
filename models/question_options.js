'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question_Options extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question_Options.belongsTo(models.Question,{
        foreignKey:'question_id',
        onDelete:"CASCADE"
      });
      Question_Options.belongsToMany(models.Property_Question,{
        through:'Property_Question_Option',
        foreignKey:'option_id',
        onDelete:"CASCADE"
      });
      Question_Options.belongsToMany(models.Property_Question_Submission,{
        through:"Question_Submission_Option",
        foreignKey:"option_id",
        onDelete:"CASCADE"
      })
    }
  }
  Question_Options.init({
    question_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    preferred: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question_Options',
  });
  return Question_Options;
};