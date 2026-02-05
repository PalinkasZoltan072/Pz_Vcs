const { Op } = require("sequelize");

module.exports = function cipoFilter(req, res, next) {
  const { nev, marka, meret, tipus, minAr, maxAr } = req.query;

  const filter = {};

  if (nev && nev.trim() !== "") {
    filter.nev = { [Op.like]: `%${nev.trim()}%` };
  }

  if (marka && marka.trim() !== "") {
    filter.marka = { [Op.like]: `%${marka.trim()}%` };
  }

  if (tipus && tipus.trim() !== "") {
    filter.tipus = tipus.trim();
  }

  if (meret !== undefined && meret !== "") {
    const m = Number(meret);
    if (!Number.isNaN(m)) filter.meret = m;
  }

  if (minAr !== undefined && minAr !== "") {
    const a = Number(minAr);
    if (!Number.isNaN(a)) {
      filter.ar = { ...(filter.ar || {}), [Op.gte]: a };
    }
  }

  if (maxAr !== undefined && maxAr !== "") {
    const a = Number(maxAr);
    if (!Number.isNaN(a)) {
      filter.ar = { ...(filter.ar || {}), [Op.lte]: a };
    }
  }

  
  req.cipoFilter = filter;

  next();
};
