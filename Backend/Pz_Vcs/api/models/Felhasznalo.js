const {Model,DataTypes} = require("sequelize")

module.exports = (sequelize, DataTypes)=>{

    class Felhasznalo extends Model{}

    Felhasznalo.init(
        {
            id:{
                type:DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,

            },
            email:{ // cehckolni hogy helyes e az email formatum ..@.com
                type:DataTypes.STRING(40),
                allowNull:false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: "Érvénytelen email formátum"
                    }
                }
            },
            felhasznalonev:{
                type:DataTypes.STRING(25),
                allowNull:false,
                unique:true, 
            },
            jelszo:{
                type:DataTypes.STRING, // limitalva mert hash vagy 60+ karakterű
                allowNull:false,
               

            },
            telepules:{
                type: DataTypes.STRING(30),
                allowNull:false,
            },
            iranyitoszam:{
                type:DataTypes.INTEGER,
                allowNull:false,
            }, 


           



        },
        {
            sequelize,
            modelName:"Felhasznalo",
            timestamps: false
        }
    )
    return Felhasznalo

}