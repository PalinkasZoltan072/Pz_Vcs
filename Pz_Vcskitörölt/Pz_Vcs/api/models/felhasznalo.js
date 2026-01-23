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
                type:DataTypes.STRING(30),
                allowNull:false,
                validate:{
                    isEmail:true
                }
            },
            felhasznalonev:{
                type:DataTypes.STRING(25),
                allowNull:false,
                unique:true, // egyedi felhasznalonev altalaban ilyen van nem? 
            },
            jelszo:{
                type:DataTypes.STRING(20),
                allowNull:false,
                //hashelni kell valahogy elv?
                //lehetne hogy muszaj egy specialis karaktert beleirni vagy kötelező számnak lenni benne

            },
            telepules:{
                type: DataTypes.STRING(30),
                allowNull:false,
            },
            iranyitoszam:{
                type:DataTypes.INTEGER,
                allowNull:false,
            }, 


            //az agrajzban nincs cim még
            //utca meg rendes cím kéne nem?
            // cim:{
            //     type: DataTypes.VARCHAR(30) // leirni placeholderbe egy mintat hogy hogy kerjuk megadni az utcat és házszámot 
            // }



        },
        {
            sequelize,
            modelName:"Felhasznalo",
            timestamps: false
        }
    )
    return Felhasznalo

}