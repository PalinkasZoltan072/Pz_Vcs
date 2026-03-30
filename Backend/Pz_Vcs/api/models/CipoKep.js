const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

  class CipoKep extends Model {}

  CipoKep.init({

    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },

    cipo_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },

    url:{
      type:DataTypes.STRING,
      allowNull:false
    }

  },
  {
    sequelize,
    modelName:"CipoKep",
    tableName:"cipo_kepek",
    timestamps:false
  })

  return CipoKep
}