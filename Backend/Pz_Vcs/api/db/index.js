


const { Sequelize } = require("sequelize");
const { DbError } = require("../errors");

let sequelize;

if (process.env.NODE_ENV === "test") {

    // 🔥 TESZT KÖRNYEZET → SQLITE MEMORY
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    });

} else {

    // 🔥 DEV / PROD → MYSQL
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
            logging: false,
        }
    );
}

const models = require("../models")(sequelize);

const db = {
    Sequelize,
    sequelize,
    ...models,
};

// 🔥 Csak akkor authenticate + seed + sync ha NEM teszt
if (process.env.NODE_ENV !== "test") {

    (async () => {
        try {
            console.log("Trying to connect to database");
            await db.sequelize.authenticate();
            console.log("Database connection established successfully");
        } catch (error) {
            throw new DbError("Failed connecting to database");
        }
    })();

    const seed = require("./seeders/seed");

    (async () => {
        try {
            console.log("Trying to sync to database");
            await db.sequelize.sync();
            console.log("Database sync successful");
            await seed(db);
        } catch (error) {
            console.error("REAL ERROR:", error);
            throw error;
        }
    })();
}

module.exports = db;



// require("dotenv").config();
// console.log("DIALECT:", process.env.DB_DIALECT);

// const { Sequelize } = require("sequelize");

// const { DbError } = require("../errors");

// const sequelize = new Sequelize
// (
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,

//     {
//         host: process.env.DB_HOST,
//         dialect: process.env.DB_DIALECT,

//         logging: false,
//     }
// );


// const models = require("../models")(sequelize);

// const db = 
// {
//     Sequelize,
//     sequelize,
//     ...models,
// };

// (async () => 
// {
//     try
//     {
//         console.log("Trying to connect to database");

//         await db.sequelize.authenticate();

//         console.log("Database connection established successfully");
//     }
//     catch(error)
//     {
//         throw new DbError("Failed connecting to database");
//     }
// })();
// const seed = require("./seeders/seed");

// (async () => 
// {
//     try
//     {
//         console.log("Trying to sync to database");

//         await db.sequelize.sync();

//         console.log("Database sync successful");

//         await seed(db); // 👈 ITT hívjuk meg

//     }
//     catch(error)
//     {
//         console.error("REAL ERROR:", error);
//         throw error;
//     }
// })();

// module.exports = db;

