const { Op } = require("sequelize");

module.exports = function felhasznaloFilter(req, res, next) {
  const { email, felhasznalonev, telepules, iranyitoszam } = req.query;

  const filter = {};

  // email részleges keresés
  if (email && email.trim() !== "") {
    filter.email = { [Op.like]: `%${email.trim()}%` };
  }

  // felhasználónév részleges keresés
  if (felhasznalonev && felhasznalonev.trim() !== "") {
    filter.felhasznalonev = { [Op.like]: `%${felhasznalonev.trim()}%` };
  }

  // település részleges keresés
  if (telepules && telepules.trim() !== "") {
    filter.telepules = { [Op.like]: `%${telepules.trim()}%` };
  }

  // irányítószám (szám -> pontos egyezés)
  if (iranyitoszam !== undefined && iranyitoszam !== "") {
    const i = Number(iranyitoszam);
    if (!Number.isNaN(i)) filter.iranyitoszam = i;
  }

  req.felhasznaloFilter = filter;
  next();
};
