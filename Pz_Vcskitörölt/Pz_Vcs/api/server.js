const app = require("./app");

const port = 4000;

app.listen(port, () => {
  console.log(`Server fut: http://localhost:${port}`);
});



// ezzel futtatod a dolgokat npx nodemon api/server.js
// uj futtatashoz cd api
// npx nodemon server.js