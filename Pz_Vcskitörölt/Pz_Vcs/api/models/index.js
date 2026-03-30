const { DataTypes} = require("sequelize")



module.exports = (sequelize) =>{
    const Cipo = require("./Cipo")(sequelize, DataTypes)
    const Felhasznalo = require("./Felhasznalo")(sequelize,DataTypes)
    const Rendeles = require("./Rendeles")(sequelize,DataTypes)
    const Admin = require("./Admin")(sequelize, DataTypes)
    const CipoMeret = require("./CipoMeret")(sequelize,DataTypes) // nem tudom biztosra kell e ide is a datatypes de biztos ami tuti
    const CipoKep = require("./CipoKep")(sequelize,DataTypes)
    
    Cipo.hasMany(Rendeles,{
         foreignKey:"Cipo_id"
    });
    Rendeles.belongsTo(Cipo,{
        foreignKey:"Cipo_id"
        
    })
    Felhasznalo.hasMany(Rendeles,{
        foreignKey: "Felhasznalo_id"
    })
    Rendeles.belongsTo(Felhasznalo,{
        foreignKey: "Felhasznalo_id"
    })
    Cipo.hasMany(CipoMeret,{
        foreignKey:"cipo_id",
        as: "Meretek",
      })
      
      CipoMeret.belongsTo(Cipo,{
        foreignKey:"cipo_id"
      })
      Cipo.hasMany(CipoKep,{
        foreignKey:"cipo_id",
        as:"kepek"
      })
      
      CipoKep.belongsTo(Cipo,{
        foreignKey:"cipo_id"
      })
    
    
    return{ Cipo,  Felhasznalo, Rendeles, Admin, CipoMeret,CipoKep} 
}
