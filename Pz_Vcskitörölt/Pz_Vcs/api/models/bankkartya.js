// //most itt mennyire kell/lehet eltarolni az adatokat?
// const { Model } = require("sequelize");

// module.exports = (sequelize, DataTypes) => {
//     class Bankkartya extends Model {}

//     Bankkartya.init(
//         {
//             id: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false,
//                 autoIncrement: true,
//                 primaryKey: true,
//             },
//             kartyaszam: {
//                 type: DataTypes.STRING(20),
//                 allowNull: false,
//             },
//             lejarat: {
//                 type: DataTypes.STRING(5),   // pl. "12/28"
//                 allowNull: false,
//             },
//             cvc: {
//                 type: DataTypes.STRING(3),
//                 allowNull: false,
//             },
//         },
//         {
//             sequelize,
//             modelName: "Bankkartya",
            
//         }
//     );

//     return Bankkartya;
// };