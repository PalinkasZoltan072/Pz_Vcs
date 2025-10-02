const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",          // vagy az adatbázisod felhasználóneve
  password: "",          // jelszó, ha van
  database: "pz_vcs",  // az adatbázis neve
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;

//npm install mysql2