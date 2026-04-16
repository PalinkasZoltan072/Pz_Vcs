const bcrypt = require("bcrypt");

async function seed(db) {
  console.log("Seeding started...");

  
  const adminExists = await db.Admin.findOne({ where: { email: "admin@gmail.com" } });
  if (!adminExists) {
    await db.Admin.create({
      felhasznalonev: "admin",
      email: "admin@gmail.com",
      jelszo: bcrypt.hashSync("admin123", 10),
    });
  }

 
  let user = await db.Felhasznalo.findOne({ where: { email: "user@gmail.com" } });
  if (!user) {
    user = await db.Felhasznalo.create({
      email: "user@gmail.com",
      felhasznalonev: "user1",
      jelszo: bcrypt.hashSync("user123", 10),
      telepules: "Budapest",
      iranyitoszam: 1111,
    });
  }

  
  const existingCipo = await db.Cipo.findOne({ where: { nev: "Air Jordan 1 Mid" } });

  if (!existingCipo) {
    const cipokData = [
      { ar: 65000, nev: "Air Jordan 1 High OG Rare Air", marka: "Nike", tipus: "kosárcipő" },
      { ar: 55000, nev: "Air Jordan 1 Mid", marka: "Nike", tipus: "kosárcipő" },
      { ar: 52000, nev: "Air Jordan 1 Mid SE", marka: "Nike", tipus: "kosárcipő" },
      { ar: 85000, nev: "Air Jordan 4 Retro Cave Stone", marka: "Nike", tipus: "kosárcipő" },
      { ar: 78000, nev: "Air Jordan 4 RM", marka: "Nike", tipus: "kosárcipő" },
      { ar: 48000, nev: "Air Jordan MVP 92", marka: "Nike", tipus: "kosárcipő" },
      { ar: 42000, nev: "airforce1", marka: "Nike", tipus: "utcai cipő" },
      { ar: 45000, nev: "Jordan CMFT Era", marka: "Nike", tipus: "utcai cipő" },
      { ar: 52000, nev: "Jordan Flight Court", marka: "Nike", tipus: "kosárcipő" },
      { ar: 48000, nev: "Jordan Session", marka: "Nike", tipus: "utcai cipő" },
      { ar: 55000, nev: "Jordan Spizike Low", marka: "Nike", tipus: "utcai cipő" },
      { ar: 58000, nev: "Jordan Trunner", marka: "Nike", tipus: "utcai cipő" },
      { ar: 52000, nev: "Nike Air Max 90", marka: "Nike", tipus: "utcai cipő" },
      { ar: 48000, nev: "Nike Air Max 90 Essential+", marka: "Nike", tipus: "utcai cipő" },
      { ar: 55000, nev: "Nike Air Max Plus", marka: "Nike", tipus: "utcai cipő" },
      { ar: 58000, nev: "Nike Air Max Waffle SP", marka: "Nike", tipus: "utcai cipő" },
      { ar: 32000, nev: "Nike Air Monarch IV", marka: "Nike", tipus: "utcai cipő" },
      { ar: 38000, nev: "Nike Ava Rover", marka: "Nike", tipus: "utcai cipő" },
      { ar: 45000, nev: "Nike Dunk Low Retro", marka: "Nike", tipus: "utcai cipő" },
      { ar: 48000, nev: "Nike Dunk Low Retro SE", marka: "Nike", tipus: "utcai cipő" },
      { ar: 42000, nev: "Nike P-6000", marka: "Nike", tipus: "utcai cipő" },
      { ar: 45000, nev: "Nike P-6000 Tech", marka: "Nike", tipus: "utcai cipő" },
      { ar: 35000, nev: "Nike Revolution 8", marka: "Nike", tipus: "utcai cipő" },
      { ar: 38000, nev: "Nike SB PS8", marka: "Nike", tipus: "utcai cipő" },
      { ar: 52000, nev: "Zion 4", marka: "Nike", tipus: "kosárcipő" },
    ];

    const createdShoes = await db.Cipo.bulkCreate(cipokData);
    console.log(`${createdShoes.length} cipő létrehozva.`);

   
    const meretek = [];
    for (const shoe of createdShoes) {
      for (let meret = 38; meret <= 46; meret++) {
        meretek.push({ cipo_id: shoe.id, meret: meret });
      }
    }
    await db.CipoMeret.bulkCreate(meretek);
    console.log("Méretek létrehozva.");

   
    const kepek = [];
    for (const shoe of createdShoes) {
      // Fő kép
      kepek.push({ cipo_id: shoe.id, url: "kezdokep.avif" });
      
      // Többi kép 2-től 8-ig
      for (let i = 2; i <= 8; i++) {
        kepek.push({ cipo_id: shoe.id, url: `${i}.avif` });
      }
    }
    await db.CipoKep.bulkCreate(kepek);
    console.log("Képek létrehozva (kezdokep.avif + 2-8.avif).");
  }

 
  const cipo = await db.Cipo.findOne({ where: { nev: "Air Jordan 1 Mid" } });
  
  if (cipo) {
    const rendelesExists = await db.Rendeles.findOne({
      where: { Cipo_id: cipo.id, Felhasznalo_id: user.id, meret: 42 }
    });

    if (!rendelesExists) {
      await db.Rendeles.create({
        allapot: "szállítás alatt",
        fizetes: "kártyával",
        meret: 42,
        mennyiseg: 2,
        Cipo_id: cipo.id,
        Felhasznalo_id: user.id
      });
    }
  }

  console.log("Seeding kész!");
}

module.exports = seed;
