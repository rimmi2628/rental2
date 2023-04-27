'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsToMany(models.Property,{
        through:'Property_Image',
        as:'property_image',
        foreignKey:'image_id',
        onDelete:"CASCADE"
      });
      Image.belongsToMany(models.Property_Room,{
        through:'Property_Room_Image',
        foreignKey:'image_id',
        onDelete:"CASCADE"
      })
      Image.hasOne(models.Property_Applicant,{
        foreignKey:"image_id",
        onDelete:"CASCADE",
        constraints:false
      })
    }
  }
  Image.init({
    caption: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    file_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};