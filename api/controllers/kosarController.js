const db = require("../db");


exports.getKosarByFelhasznalo = async (req, res) => {
  try {
    const { username } = req.params;
    const [rows] = await db.execute(`
      SELECT k.id, k.mennyiseg, c.marka, c.meret, c.ar
      FROM kosar k
      JOIN cipok c ON k.cipo_id = c.id
      WHERE k.felhasznalonev = ?
    `, [username]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addToKosar = async (req, res) => {
  try {
    const { username, cipo_id, mennyiseg } = req.body;

   
    const [existing] = await db.execute(
      "SELECT id, mennyiseg FROM kosar WHERE felhasznalonev = ? AND cipo_id = ?",
      [username, cipo_id]
    );

    if (existing.length > 0) {
     
      await db.execute(
        "UPDATE kosar SET mennyiseg = mennyiseg + ? WHERE id = ?",
        [mennyiseg, existing[0].id]
      );
    } else {
      
      await db.execute(
        "INSERT INTO kosar (felhasznalonev, cipo_id, mennyiseg) VALUES (?, ?, ?)",
        [username, cipo_id, mennyiseg]
      );
    }

    res.status(201).json({ message: "Kosár frissítve!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.removeFromKosar = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM kosar WHERE id = ?", [id]);
    res.json({ message: "Elem törölve a kosárból!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.clearKosar = async (req, res) => {
  try {
    const { username } = req.params;
    await db.execute("DELETE FROM kosar WHERE felhasznalonev = ?", [username]);
    res.json({ message: "Kosár ürítve!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};