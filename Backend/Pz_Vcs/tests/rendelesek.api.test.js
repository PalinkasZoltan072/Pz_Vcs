require("dotenv").config({
  path: "./.env.test",
  quiet: true,
});

process.env.NODE_ENV = "test";

const request = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../api/app");
const db = require("../api/db");

describe("Rendelések API - tranzakciós teszt", () => {
  let adminToken;
  let user1Token;
  let user2Token;

  let cipo1Id;
  let cipo2Id;
  let user1Id;
  let user2Id;

  beforeAll(async () => {
    await db.sequelize.sync();

    // Cipők
    const cipo1 = await db.Cipo.create({
      nev: "Mercurial",
      marka: "Nike",
      ar: 39990,
      tipus: "focicipő",
    });

    const cipo2 = await db.Cipo.create({
      nev: "Superstar",
      marka: "Adidas",
      ar: 29990,
      tipus: "utcai cipő",
    });

    cipo1Id = cipo1.id;
    cipo2Id = cipo2.id;

    // Admin
    await db.Admin.create({
      felhasznalonev: "admin",
      email: "admin@test.hu",
      jelszo: bcrypt.hashSync("admin123", 10),
    });

    const adminLogin = await request(app)
      .post("/adminok/login")
      .send({ email: "admin@test.hu", jelszo: "admin123" });

    adminToken = adminLogin.body.token;

    // User1
    const user1 = await db.Felhasznalo.create({
      felhasznalonev: "kisspeter",
      email: "kiss@test.hu",
      jelszo: bcrypt.hashSync("peter123", 10),
      telepules: "Szeged",
      iranyitoszam: 6720,
    });

    user1Id = user1.id;

    const user1Login = await request(app)
      .post("/felhasznalok/login")
      .send({ email: "kiss@test.hu", jelszo: "peter123" });

    user1Token = user1Login.body.token;

    // User2
    const user2 = await db.Felhasznalo.create({
      felhasznalonev: "nagyanna",
      email: "anna@test.hu",
      jelszo: bcrypt.hashSync("anna123", 10),
      telepules: "Debrecen",
      iranyitoszam: 4025,
    });

    user2Id = user2.id;

    const user2Login = await request(app)
      .post("/felhasznalok/login")
      .send({ email: "anna@test.hu", jelszo: "anna123" });

    user2Token = user2Login.body.token;
  });

  // =========================
  // GET ALL (ADMIN)
  // =========================
  describe("GET /rendelesek", () => {
    test("401 ha nincs token", async () => {
      const res = await request(app).get("/rendelesek");
      expect(res.status).toBe(401);
    });

    test("401 ha nem admin", async () => {
      const res = await request(app)
        .get("/rendelesek")
        .set("Authorization", `Bearer ${user1Token}`);
      expect(res.status).toBe(401);
    });

    test("admin lekéri az összes rendelést", async () => {
      await db.Rendeles.create({
        allapot: "szállítás alatt",
        fizetes: "kártyával",
        mennyiseg: 2,
        meret: 38, // Egyedi méret a unique constraint miatt
        Cipo_id: cipo1Id,
        Felhasznalo_id: user1Id,
      });

      const res = await request(app)
        .get("/rendelesek")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  // =========================
  // GET BY ID
  // =========================
  describe("GET /rendelesek/:id", () => {
    test("user lekérheti a saját rendelését", async () => {
      const rendeles = await db.Rendeles.create({
        allapot: "szállítás alatt",
        fizetes: "kártyával",
        mennyiseg: 1,
        meret: 39,
        Cipo_id: cipo1Id,
        Felhasznalo_id: user1Id,
      });

      const res = await request(app)
        .get(`/rendelesek/${rendeles.id}`)
        .set("Authorization", `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(rendeles.id);
    });

    test("user nem kérheti le más rendelését", async () => {
      const rendeles = await db.Rendeles.create({
        allapot: "szállítás alatt",
        fizetes: "kártyával",
        mennyiseg: 1,
        meret: 40,
        Cipo_id: cipo1Id,
        Felhasznalo_id: user1Id,
      });

      const res = await request(app)
        .get(`/rendelesek/${rendeles.id}`)
        .set("Authorization", `Bearer ${user2Token}`);

      expect(res.status).toBe(401);
    });

    test("admin lekérheti bárki rendelését", async () => {
      const rendeles = await db.Rendeles.create({
        allapot: "szállítás alatt",
        fizetes: "kártyával",
        mennyiseg: 1,
        meret: 41,
        Cipo_id: cipo1Id,
        Felhasznalo_id: user1Id,
      });

      const res = await request(app)
        .get(`/rendelesek/${rendeles.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });

  // =========================
  // POST
  // =========================
  describe("POST /rendelesek", () => {
    test("401 ha nincs token", async () => {
      const res = await request(app).post("/rendelesek").send({});
      expect(res.status).toBe(401);
    });

    test("user létrehoz rendelést (saját ID-val)", async () => {
      const res = await request(app)
        .post("/rendelesek")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          cipoId: cipo1Id,
          mennyiseg: 3,
          fizetes: "kártyával",
          meret: 42 // <-- Most már ezt is be fogja fogadni a Controller!
        });

      expect(res.status).toBe(201);
      expect(res.body.mennyiseg).toBe(3);

      const found = await db.Rendeles.findOne({
        where: { Felhasznalo_id: user1Id, mennyiseg: 3 },
      });

      expect(found).not.toBeNull();
    });

    test("400 ha negatív mennyiség", async () => {
      const res = await request(app)
        .post("/rendelesek")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          cipoId: cipo1Id,
          mennyiseg: -5,
          fizetes: "kártyával",
          meret: 43
        });

      expect(res.status).toBe(400);
    });
  });
  // =========================
  // PATCH (ADMIN)
  // =========================
  describe("PATCH /rendelesek/:id", () => {
    test("401 ha nem admin", async () => {
      const rendeles = await db.Rendeles.create({
        allapot: "szállítás alatt",
        fizetes: "kártyával",
        mennyiseg: 2,
        meret: 44,
        Cipo_id: cipo1Id,
        Felhasznalo_id: user1Id,
      });

      const res = await request(app)
        .patch(`/rendelesek/${rendeles.id}`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ allapot: "kiszállítva" });

      expect(res.status).toBe(401);
    });

    test("admin módosítja a rendelést", async () => {
      const rendeles = await db.Rendeles.create({
        allapot: "szállítás alatt",
        fizetes: "kártyával",
        mennyiseg: 2,
        meret: 45,
        Cipo_id: cipo1Id,
        Felhasznalo_id: user1Id,
      });

      const res = await request(app)
        .patch(`/rendelesek/${rendeles.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ allapot: "kiszállítva" });

      expect(res.status).toBe(200);

      const updated = await db.Rendeles.findByPk(rendeles.id);
      expect(updated.allapot).toBe("kiszállítva");
    });
  });

  // =========================
  // DELETE (ADMIN)
  // =========================
  describe("DELETE /rendelesek/:id", () => {
    test("admin törli a rendelést", async () => {
      const rendeles = await db.Rendeles.create({
        allapot: "szállítás alatt",
        fizetes: "kártyával",
        mennyiseg: 2,
        meret: 46,
        Cipo_id: cipo1Id,
        Felhasznalo_id: user1Id,
      });

      const res = await request(app)
        .delete(`/rendelesek/${rendeles.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const found = await db.Rendeles.findByPk(rendeles.id);
      expect(found).toBeNull();
    });
  });
});