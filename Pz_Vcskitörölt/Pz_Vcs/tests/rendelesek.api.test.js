// tests/rendelesek.api.test.js
// full ai majd azert atnezni! meg hogy egyaltalana kell e 
jest.mock("../api/db"); // a mock DB-t használjuk (sqlite memory)

const request = require("supertest");
const app = require("../api/app");
const db = require("../api/db");

describe("Rendelések API /rendelesek", () => {
  // seed adatok
  const cipok = [
    { nev: "Mercurial", marka: "Nike", meret: 42, ar: 39990, tipus: "focicipő" },
    { nev: "Superstar", marka: "Adidas", meret: 41, ar: 29990, tipus: "utcai cipő" },
  ];

  const felhasznalok = [
    { felhasznalonev: "kisspeter", email: "kiss.peter@gmail.com", jelszo: "peter123", telepules: "Szeged", iranyitoszam: 6720 },
    { felhasznalonev: "nagyanna", email: "nagy.anna@gmail.com", jelszo: "anna2024", telepules: "Debrecen", iranyitoszam: 4025 },
  ];

  let cipo1Id, cipo2Id, user1Id, user2Id;

  const rendelesekAlap = () => ([
    { allapot: "szállítás alatt", fizetes: "kártyával", mennyiseg: 2, Cipo_id: cipo1Id, Felhasznalo_id: user1Id },
    { allapot: "kiszállítva", fizetes: "utánvéttel", mennyiseg: 1, Cipo_id: cipo2Id, Felhasznalo_id: user2Id },
  ]);

  beforeAll(async () => {
    // táblák létrehozása a mock sqlite DB-ben
    await db.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // 1) cipők
    const createdCipok = await db.Cipo.bulkCreate(cipok, { returning: true });
    cipo1Id = createdCipok[0].id;
    cipo2Id = createdCipok[1].id;

    // 2) felhasználók
    const createdUsers = await db.Felhasznalo.bulkCreate(felhasznalok, { returning: true });
    user1Id = createdUsers[0].id;
    user2Id = createdUsers[1].id;

    // 3) rendelések (FK-k miatt csak ezután!)
    await db.Rendeles.bulkCreate(rendelesekAlap());
  });

  afterEach(async () => {
    // FK miatt törlési sorrend: Rendeles -> Cipo/Felhasznalo
    await db.Rendeles.destroy({ where: {} });
    await db.Cipo.destroy({ where: {} });
    await db.Felhasznalo.destroy({ where: {} });
  });

  describe("GET /rendelesek", () => {
    test("visszaadja az összes rendelést", async () => {
      const res = await request(app)
        .get("/rendelesek")
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.type).toMatch(/json/);

      // minimum ellenőrzés: 2 darab rendelés
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);

      // kulcsok legyenek benne (nem függünk a pontos sorrendtől)
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("allapot");
      expect(res.body[0]).toHaveProperty("fizetes");
      expect(res.body[0]).toHaveProperty("mennyiseg");
      expect(res.body[0]).toHaveProperty("Cipo_id");
      expect(res.body[0]).toHaveProperty("Felhasznalo_id");
    });
  });

  describe("GET /rendelesek/:id", () => {
    test("visszaad egy rendelést id alapján", async () => {
      const first = await db.Rendeles.findOne();
      expect(first).toBeDefined();

      const res = await request(app)
        .get(`/rendelesek/${first.id}`)
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.type).toMatch(/json/);

      expect(res.body.id).toBe(first.id);
      expect(res.body.allapot).toBe(first.allapot);
    });
  });

  describe("POST /rendelesek", () => {
    test("létrehoz egy új rendelést", async () => {
      const uj = {
        allapot: "szállítás alatt",
        fizetes: "kártyával",
        mennyiseg: 3,
        Cipo_id: cipo1Id,
        Felhasznalo_id: user2Id,
      };

      const res = await request(app)
        .post("/rendelesek")
        .send(uj);
        

      expect(res.status).toBe(201);
      expect(res.type).toMatch(/json/);
      console.log(res.status, res.body);
      // a válaszban benne van az új rendelés
      expect(res.body).toMatchObject({
        allapot: uj.allapot,
        fizetes: uj.fizetes,
        mennyiseg: uj.mennyiseg,
        Cipo_id: uj.Cipo_id,
        Felhasznalo_id: uj.Felhasznalo_id,
      });

      // DB-ben tényleg létrejött?
      const found = await db.Rendeles.findOne({ where: { mennyiseg: 3, Cipo_id: cipo1Id, Felhasznalo_id: user2Id } });
      expect(found).toBeDefined();
      expect(found.mennyiseg).toBe(3);
    });
  });

  describe("PATCH /rendelesek/:id", () => {
    test("módosít egy rendelést", async () => {
      const first = await db.Rendeles.findOne();
      const patch = { allapot: "kiszállítva", mennyiseg: 5 };

      const res = await request(app)
        .patch(`/rendelesek/${first.id}`)
        .send(patch);

      expect(res.status).toBe(200);
      expect(res.type).toMatch(/json/);

      // FIGYELEM: ha nálad más az üzenet, ezt írd át!
      // pl. "Rendelés frissítve" vs "Rendelés módosítva"
      expect(res.body).toHaveProperty("message");

      const updated = await db.Rendeles.findByPk(first.id);
      expect(updated.allapot).toBe("kiszállítva");
      expect(updated.mennyiseg).toBe(5);
    });
  });

  describe("DELETE /rendelesek/:id", () => {
    test("töröl egy rendelést", async () => {
      const first = await db.Rendeles.findOne();

      const res = await request(app)
        .delete(`/rendelesek/${first.id}`);

      expect(res.status).toBe(200);
      expect(res.type).toMatch(/json/);

      // FIGYELEM: ha nálad más az üzenet, ezt írd át!
      expect(res.body).toHaveProperty("message");

      const found = await db.Rendeles.findByPk(first.id);
      expect(found).toBeNull();
    });
  });
});
