require("dotenv").config();
console.log("DIALECT:", process.env.DB_DIALECT);

const { Sequelize } = require("sequelize");

const { DbError } = require("../errors");

const sequelize = new Sequelize
(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,

    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,

        logging: false,
    }
);


const models = require("../models")(sequelize);

const db = 
{
    Sequelize,
    sequelize,
    ...models,
};

(async () => 
{
    try
    {
        console.log("Trying to connect to database");

        await db.sequelize.authenticate();

        console.log("Database connection established successfully");
    }
    catch(error)
    {
        throw new DbError("Failed connecting to database");
    }
})();

(async () => 
{
    try
    {
        console.log("Trying to sync to database");

        await db.sequelize.sync();

        console.log("Database sync successful");
    }
    catch(error)
    {
        throw new DbError("Failed syncing to database");
    }
})();

module.exports = db;

