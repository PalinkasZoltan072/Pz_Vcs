const db = require("../db");


exports.getFelhasznalok = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT felhasznalonev, email FROM felhasznalok");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getFelhasznaloByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const [rows] = await db.execute(
      "SELECT felhasznalonev, email FROM felhasznalok WHERE felhasznalonev = ?",
      [username]
    );
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.regisztral = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Hiányzó adatok!" });
    }

    const sql = "INSERT INTO felhasznalok (felhasznalonev, email, jelszo_hash) VALUES (?, ?, ?)";
    await db.execute(sql, [username, email, password]);

    res.status(201).json({ message: "Sikeres regisztráció!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Hiba az adatbázisban!" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Hiányzó adatok!" });
    }

    const [rows] = await db.execute(
      "SELECT felhasznalonev, email FROM felhasznalok WHERE email = ? AND jelszo_hash = ?",
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Helytelen email vagy jelszó!" });
    }

    res.json({ message: `Szia, ${rows[0].felhasznalonev}! Sikeresen bejelentkeztél.`, user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Hiba az adatbázisban!" });
  }
};