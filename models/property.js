'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property.belongsTo(models.User,
        {
          foreignKey:"user_id",
          as:"properties",
          onDelete:"CASCADE"
        });

        Property.belongsToMany(models.Image,{
          through:'Property_Image',
          as:'property_image',
          foreignKey:"property_id",
       
        });
        Property.belongsToMany(models.Amenity,{
          through:'Property_Amenity',
          foreignKey:'property_id',
  
       
        });
        Property.hasMany(models.Property_Room,{
            foreignKey:'property_id',
            onDelete:"CASCADE"
        });
        Property.hasMany(models.Property_Question,{
          foreignKey:'property_id',
          onDelete:"CASCADE"
        })
      Property.hasMany(models.Property_Applicant,{

        foreignKey:'property_id',
        onDelete:"CASCADE"
      })
      Property.hasMany(models.Property_Tenant,{
        foreignKey:"property_id",
        onDelete:"CASCADE"
      })
    }
  }
    Property.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    property_type: DataTypes.INTEGER,
    tenancy_status: DataTypes.INTEGER,
    address: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    country: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    area: DataTypes.STRING,
    furnishing_status: DataTypes.INTEGER,
    share_property_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Property',
  });
  return Property;
};