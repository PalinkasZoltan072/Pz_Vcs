const {Model,DataTypes} = require("sequelize")

module.exports = (sequelize, DataTypes)=>{

  class CipoMeret extends Model {}

  CipoMeret.init(
  {
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
      allowNull:false

    },

    cipo_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },

    meret:{
      type:DataTypes.INTEGER,
      allowNull:false
    }

  },
  {
    sequelize,
    modelName:"CipoMeret",
    timestamps:false
  })

  return CipoMeret
}