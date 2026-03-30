const {Model} = require("sequelize")
// ide a Model melle most kell datatypes vagy neeem???
module.exports = (sequelize, DataTypes) =>{
    class Rendeles extends Model{}

    Rendeles.init(
        {
            id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey:true
                
            },
            allapot:{
                type:DataTypes.ENUM("kosár","kiszállítva","szállítás alatt"),
                allowNull: false,
                validate:
                {
                    isIn: [ ["kosár","kiszállítva", "szállítás alatt"] ], //Models nevű órain csinaltuk így az enumokkal ez gondolom az hogy megegyezike e a felhasznaló által beküldött adat valamelyik enum mezőnkkel
                }
            },
            fizetes:{
                type: DataTypes.ENUM("kártyával", "utánvéttel"),
                allowNull: false,
                validate:
                {
                    isIn: [ ["kártyával", "utánvéttel"] ], //Models nevű órain csinaltuk így az enumokkal ez gondolom az hogy megegyezike e a felhasznaló által beküldött adat valamelyik enum mezőnkkel
                }
            },
            meret:{
                type: DataTypes.INTEGER,
                allowNull:false,
                validate:{
                    min:30,
                    max:55
                }
            },
            mennyiseg:{ // lehetne h max pl 100 termeket lehessen egyszerre venni vagy valamennyire leszabalyozni a db szamot
                type: DataTypes.INTEGER,
                allowNull:false,
                validate: { // ez így jó?
                    min:1,
                    max:100,
                },
            }
        },
        {
            sequelize,
            modelName: "Rendeles",
            timestamps: false,
            indexes:[
                {
                 unique:true,
                 fields:["Felhasznalo_id","Cipo_id","meret","allapot"]
                }
                ]
        }
    )
    return Rendeles
}