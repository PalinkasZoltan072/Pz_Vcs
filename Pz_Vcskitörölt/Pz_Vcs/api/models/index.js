const { DataTypes} = require("sequelize")



module.exports = (sequelize) =>{
    const Cipo = require("./cipo")(sequelize, DataTypes)
    const Felhasznalo = require("./felhasznalo")(sequelize,DataTypes)
    const Rendeles = require("./rendeles")(sequelize,DataTypes)
    const Admin = require("./admin")(sequelize, DataTypes)
   // const Bankkartya = require("./bankkartya")(sequelize,DataTypes)
    
    Cipo.hasMany(Rendeles,{
         foreignKey:"Cipo_id"
    });
    Rendeles.belongsTo(Cipo,{
        foreignKey:"Cipo_id"
        //as: kell?
    })
    Felhasznalo.hasMany(Rendeles,{
        foreignKey: "Felhasznalo_id"
    })
    Rendeles.belongsTo(Felhasznalo,{
        foreignKey: "Felhasznalo_id"
    })
    // Felhasznlo.hasMany(Bankkartya,{
    //     foreignKey:"felhasznalo_id"
    // })
    // Bankkartya.belongsTo(Felhasznlo,{
    //     foreignKey:"felhasznalo_id"
    // })
    
    return{ Cipo,  Felhasznalo, Rendeles, Admin} //Bankkartya}
}
