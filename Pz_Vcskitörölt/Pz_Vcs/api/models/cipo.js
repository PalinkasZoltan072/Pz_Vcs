const {Model,DataTypes} = require ("sequelize")

module.exports = (sequelize, DataTypes) =>{
    class Cipo extends Model {}

    Cipo.init(
        {
            id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement:true,
                primaryKey: true,
            },
            meret:{
                type:DataTypes.INTEGER,
                allowNull:false,
            },
            ar:{
                type: DataTypes.INTEGER, 
                allowNull:false,
            },
            nev:{
                type:DataTypes.STRING(40),
                allowNull: false,
            },
            marka:{
                type:DataTypes.STRING(15),
                allowNull:false,
            },
            tipus:{
                type:DataTypes.ENUM("focicipő","utcai cipő","kosárcipő"),
                allowNull:false,
                validate:
                {
                    isIn: [ ["focicipő", "utcai cipő","kosárcipő" ] ], //Models nevű órain csinaltuk így az enumokkal ez gondolom az hogy megegyezike e a felhasznaló által beküldött adat valamelyik enum mezőnkkel
                }
            }

            

            
        },
        {
            sequelize,
            modelName:"Cipo",
            timestamps: false

        }
    );
    return Cipo
}