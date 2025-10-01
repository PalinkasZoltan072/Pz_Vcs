const db = require("../db");

exports.getRendelesek = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.id, r.felhasznalo_id, r.cipo_id, c.marka AS cipo_marka, r.mennyiseg, r.osszeg,
             r.telepules, r.utca, r.iranyitoszam, r.kartyatulajdonos_neve, r.kartyaszam, r.cvc, r.rendelesi_status
      FROM rendelesek r
      JOIN cipok c ON r.cipo_id = c.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRendelesById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(`
      SELECT r.id, r.felhasznalo_id, r.cipo_id, c.marka AS cipo_marka, r.mennyiseg, r.osszeg,
             r.telepules, r.utca, r.iranyitoszam, r.kartyatulajdonos_neve, r.kartyaszam, r.cvc, r.rendelesi_status
      FROM rendelesek r
      JOIN cipok c ON r.cipo_id = c.id
      WHERE r.id = ?
    `, [id]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};