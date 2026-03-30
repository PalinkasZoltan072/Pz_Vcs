const {Model,DataTypes} = require ("sequelize")

module.exports = (sequelize, DataTypes) =>{
    class Cipo extends Model {}

    Cipo.init(
        {
          id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
          },
        
          nev:{
            type:DataTypes.STRING(40),
            allowNull:false
          },
        
          marka:{
            type:DataTypes.STRING(15),
            allowNull:false
          },
        
          ar:{
            type:DataTypes.INTEGER,
            allowNull:false
          },
        
          tipus:{
            type:DataTypes.ENUM("focicipő","utcai cipő","kosárcipő"),
            allowNull:false
          }
        
          
        
        },
        {
          sequelize,
          modelName:"Cipo",
          timestamps:false
        }
    );
    return Cipo
}