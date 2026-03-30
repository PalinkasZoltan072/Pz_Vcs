const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

// 1. Összerakjuk a pontos útvonalat: az aktuális mappa (config) -> feljebb lépünk (api) -> routes
let routesPath = path.join(__dirname, "../routes/*.js");
// 2. Kicseréljük a Windows-os visszaperjeleket előreperjelekre (ez a kulcs!)
routesPath = routesPath.replace(/\\/g, '/');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cipőbolt API",
      version: "1.0.0",
      description: "Cipőbolt backend dokumentáció",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
  },
  // 3. Itt adjuk át a kijavított útvonalat
  apis: [routesPath], 
};

const specs = swaggerJsdoc(options);

// Írassuk ki, hogy mit talált, így rögtön látjuk a terminálban!
console.log("Keresési útvonal:", routesPath);
console.log("SWAGGER ÁLTAL MEGTALÁLT VÉGPONTOK SZÁMA:", Object.keys(specs.paths || {}).length);

module.exports = { swaggerUi, specs };