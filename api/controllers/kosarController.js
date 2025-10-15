const db = require("../db");

// Kosár lekérése
exports.getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT k.id, k.termek_id, t.nev, t.ar, k.meret, k.darab 
       FROM kosar k 
       JOIN termekek t ON k.termek_id = t.id 
       WHERE k.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Termék hozzáadása a kosárhoz
exports.addToCart = async (req, res) => {
  const { userId, termekId, meret, darab } = req.body;
  try {
    await db.query(
      `INSERT INTO kosar (user_id, termek_id, meret, darab)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE darab = darab + ?`,
      [userId, termekId, meret, darab, darab]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Kosár elem frissítése
exports.updateCartItem = async (req, res) => {
  const { id, darab } = req.body;
  try {
    await db.query(`UPDATE kosar SET darab = ? WHERE id = ?`, [darab, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Kosár elem törlése
exports.removeCartItem = async (req, res) => {
  const { id } = req.body;
  try {
    await db.query(`DELETE FROM kosar WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Kosár ürítése
exports.clearCart = async (req, res) => {
  const { userId } = req.body;
  try {
    await db.query(`DELETE FROM kosar WHERE user_id = ?`, [userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};