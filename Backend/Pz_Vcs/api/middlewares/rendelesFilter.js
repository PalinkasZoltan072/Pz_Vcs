const { Op } = require("sequelize");

module.exports = function rendelesFilter(req, res, next) {
  const { allapot, fizetes, minMennyiseg, maxMennyiseg, cipoId, felhasznaloId } = req.query;

  const filter = {};

  // allapot enum -> pontos egyezés
  if (allapot && allapot.trim() !== "") {
    filter.allapot = allapot.trim();
  }

  // fizetes enum -> pontos egyezés
  if (fizetes && fizetes.trim() !== "") {
    filter.fizetes = fizetes.trim();
  }

  // cipo FK
  if (cipoId !== undefined && cipoId !== "") {
    const id = Number(cipoId);
    if (!Number.isNaN(id)) filter.Cipo_id = id;
  }

  // felhasznalo FK
  if (felhasznaloId !== undefined && felhasznaloId !== "") {
    const id = Number(felhasznaloId);
    if (!Number.isNaN(id)) filter.Felhasznalo_id = id;
  }

  // mennyiseg tartomány (>=, <=)
  if (minMennyiseg !== undefined && minMennyiseg !== "") {
    const m = Number(minMennyiseg);
    if (!Number.isNaN(m)) {
      filter.mennyiseg = { ...(filter.mennyiseg || {}), [Op.gte]: m };
    }
  }

  if (maxMennyiseg !== undefined && maxMennyiseg !== "") {
    const m = Number(maxMennyiseg);
    if (!Number.isNaN(m)) {
      filter.mennyiseg = { ...(filter.mennyiseg || {}), [Op.lte]: m };
    }
  }

  req.rendelesFilter = filter;
  next();
};
