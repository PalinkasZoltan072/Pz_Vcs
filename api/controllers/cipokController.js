const db = require("../db");

exports.getCipok = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM cipok");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCipoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM cipok WHERE id = ?", [id]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};