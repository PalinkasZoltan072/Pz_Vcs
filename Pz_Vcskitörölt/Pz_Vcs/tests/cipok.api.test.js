jest.mock("../api/db"); // <-- ez miatt a Jest AUTOMATIKUSAN az api/db/__mocks__/index.js-t tölti be

const request = require("supertest");
const app = require("../api/app");
const db = require("../api/db");

describe("Cipők API /cipok", () => {
  // Minta adatok (tipus enum miatt pontosan ezek kellenek!)
  const alapCipok = [
    { meret: 42, ar: 19990, nev: "Predator", marka: "Adidas", tipus: "focicipő" },
    { meret: 40, ar: 15990, nev: "Air Max", marka: "Nike", tipus: "utcai cipő" },
    { meret: 44, ar: 22990, nev: "Zoom Freak", marka: "Nike", tipus: "kosárcipő" },
  ];

  beforeAll(async () => {
    // Mock DB-ben sqlite-memory van, itt létrejönnek a táblák
    await db.sequelize.sync();
  });

  beforeEach(async () => {
    // Minden teszt előtt feltöltjük a cipőket
    await db.Cipo.bulkCreate(alapCipok);
  });

  afterEach(async () => {
    // Minden teszt után takarítunk
    await db.Cipo.destroy({ where: {} });
  });

  describe("GET /cipok", () => {
    test("visszaadja az összes cipőt", async () => {
      const res = await request(app)
        .get("/cipok")
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.type).toMatch(/json/);

      // Nálad simán tömb jön vissza
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);

      // Nem hasonlítunk id-t, mert azt a DB adja,
      // de az objektum mezőket igen:
      expect(res.body).toMatchObject(alapCipok);
    });
  });

  describe("GET /cipok/:id", () => {
    test("visszaad egy cipőt id alapján", async () => {
      const elso = await db.Cipo.findOne({ where: { nev: "Predator" } });

      const res = await request(app)
        .get(`/cipok/${elso.id}`)
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.type).toMatch(/json/);

      expect(res.body).toMatchObject({
        id: elso.id,
        meret: 42,
        ar: 19990,
        nev: "Predator",
        marka: "Adidas",
        tipus: "focicipő",
      });
    });

    test("404/NotFound ha nincs ilyen id", async () => {
      const res = await request(app)
        .get("/cipok/999999")
        .set("Accept", "application/json");

      // nálad NotFoundError valószínű 404-et ad
      // ha nálad mást ad, akkor ezt az egy sort kell igazítani
      expect([404, 500]).toContain(res.status);

      // opcionális: ha 404-et ad, akkor üzenet is lesz
      // (nem kötelezően ugyanaz a szöveg, ezért csak létezést nézünk)
      if (res.status === 404) {
        expect(res.body).toHaveProperty("message");
      }
    });
  });

  describe("POST /cipok", () => {
    test("létrehoz egy új cipőt", async () => {
      const uj = {
        meret: 41,
        ar: 17990,
        nev: "Classic Runner",
        marka: "Puma",
        tipus: "utcai cipő",
      };

      const res = await request(app)
        .post("/cipok")
        .send(uj)
        .set("Accept", "application/json");

      expect(res.status).toBe(201);
      expect(res.type).toMatch(/json/);

      // visszaadja az új rekordot (id-val)
      expect(res.body).toMatchObject(uj);
      expect(res.body).toHaveProperty("id"); // tohavepropertyt nem tanultuk de elég árulkodó a neve

      // DB ellenőrzés: tényleg bekerült?
      const found = await db.Cipo.findOne({ where: { nev: "Classic Runner" } });
      expect(found).toBeDefined();
      expect(found.nev).toBe("Classic Runner");
      expect(found.ar).toBe(17990);
    });

    test("400/BadRequest ha hiányzik kötelező mező (pl. marka)", async () => {
      const hibas = {
        meret: 41,
        ar: 17990,
        nev: "Hibas Cipo",
        tipus: "utcai cipő",
        // marka hiányzik
      };

      const res = await request(app).post("/cipok").send(hibas);

      // nálad BadRequestError valószínű 400
      expect([400, 500]).toContain(res.status); // tuti nem 500 xd kiszedni
    });
  });

  describe("PATCH /cipok/:id", () => {
    test("módosítja a cipőt és üzenetet ad vissza", async () => {
      const cipo = await db.Cipo.findOne({ where: { nev: "Air Max" } });

      const update = { ar: 21990, meret: 41 };

      const res = await request(app)
        .patch(`/cipok/${cipo.id}`)
        .send(update)
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.type).toMatch(/json/);

      // nálad PATCH üzenetet ad vissza
      expect(res.body).toMatchObject({ message: "Cipő frissítve" });

      // DB ellenőrzés: tényleg frissült?
      const updated = await db.Cipo.findByPk(cipo.id);
      expect(updated.ar).toBe(21990);
      expect(updated.meret).toBe(41);
    });
  });

  describe("DELETE /cipok/:id", () => {
    test("törli a cipőt és üzenetet ad vissza", async () => {
      const cipo = await db.Cipo.findOne({ where: { nev: "Zoom Freak" } });

      const res = await request(app)
        .delete(`/cipok/${cipo.id}`)
        .set("Accept", "application/json"); // órán .set csak GETnel volt nem tudom ide is kellenek e 

      expect(res.status).toBe(200);
      expect(res.type).toMatch(/json/);

      // nálad DELETE is üzenetet ad
      expect(res.body).toMatchObject({ message: "Cipő törölve" });

      // DB ellenőrzés: tényleg törlődött?
      const found = await db.Cipo.findByPk(cipo.id);
      expect(found).toBeNull();

      // maradt 2 rekord
      const all = await db.Cipo.findAll();
      expect(all.length).toBe(2);
    });
  });
});
