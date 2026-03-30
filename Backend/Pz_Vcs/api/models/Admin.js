const {Model} = require("sequelize")

module.exports = (sequelize, DataTypes) =>{
    class Admin extends Model{}
    Admin.init(
        {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            felhasznalonev:{
                type: DataTypes.STRING,
                allowNull:false,
                unique: true
            },
            email:{
                type:DataTypes.STRING,
                allowNull:false
            },
            jelszo:{
                type: DataTypes.STRING,
                allowNull:false
            }

        },
        {
            sequelize,
            modelName: "Admin",
            timestamps: false
        }
    )
    return Admin
}


