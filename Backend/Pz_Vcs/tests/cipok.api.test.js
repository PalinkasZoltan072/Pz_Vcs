require("dotenv").config({
  path: "./.env.test",
  quiet: true,
});

process.env.NODE_ENV = "test";

const request = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../api/app");
const db = require("../api/db");

describe("Cipők API - tranzakciós teszt", () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    await db.sequelize.sync();

    // Admin létrehozás
    await db.Admin.create({
      felhasznalonev: "admin",
      email: "admin@test.hu",
      jelszo: bcrypt.hashSync("admin123", 10),
    });

    // User létrehozás
    await db.Felhasznalo.create({
      felhasznalonev: "user",
      email: "user@test.hu",
      jelszo: bcrypt.hashSync("user123", 10),
      telepules: "Budapest",
      iranyitoszam: 1111,
    });
    
    // Admin login
    const adminLogin = await request(app)
      .post("/adminok/login")
      .send({
        email: "admin@test.hu",
        jelszo: "admin123",
      });

    adminToken = adminLogin.body.token;

    // User login
    const userLogin = await request(app)
      .post("/felhasznalok/login")
      .send({
        email: "user@test.hu",
        jelszo: "user123",
      });

    userToken = userLogin.body.token;
  });

  // =========================
  // GET LISTA
  // =========================
  describe("GET /cipok", () => {
    test("visszaadja az összes cipőt", async () => {
      await db.Cipo.create({
        ar: 19990,
        nev: "Predator",
        marka: "Adidas",
        tipus: "focicipő",
      });

      const res = await request(app).get("/cipok");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });
  });

  // =========================
  // GET BY ID
  // =========================
  describe("GET /cipok/:id", () => {
    test("visszaad egy cipőt id alapján", async () => {
      const cipo = await db.Cipo.create({
        ar: 15990,
        nev: "Air Max",
        marka: "Nike",
        tipus: "utcai cipő",
      });

      const res = await request(app).get(`/cipok/${cipo.id}`);

      expect(res.status).toBe(200);
      expect(res.body.nev).toBe("Air Max");
    });

    test("404 ha nem létezik", async () => {
      const res = await request(app).get("/cipok/999999");
      expect(res.status).toBe(404);
    });
  });

  // =========================
  // POST
  // =========================
  describe("POST /cipok", () => {
    test("401 ha nincs token", async () => {
      const res = await request(app)
        .post("/cipok")
        .send({
          ar: 10000,
          nev: "Test",
          marka: "Test",
          tipus: "utcai cipő",
        });

      expect(res.status).toBe(401);
    });

    test("401 ha nem admin próbál létrehozni", async () => {
      const res = await request(app)
        .post("/cipok")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          ar: 10000,
          nev: "Test",
          marka: "Test",
          tipus: "utcai cipő",
        });

      expect(res.status).toBe(401);
    });

    test("létrehoz egy új cipőt adminnal", async () => {
      const uj = {
        ar: 17990,
        nev: "Classic Runner",
        marka: "Puma",
        tipus: "utcai cipő",
      };

      const res = await request(app)
        .post("/cipok")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(uj);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(uj);
      expect(res.body).toHaveProperty("id");

      const found = await db.Cipo.findOne({ where: { nev: "Classic Runner" } });
      expect(found).not.toBeNull();
    });

    test("400 ha hiányzik kötelező mező", async () => {
      const res = await request(app)
        .post("/cipok")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          ar: 17990,
          nev: "Hibas",
        });

      expect(res.status).toBe(400);
    });
  });

  // =========================
  // PATCH
  // =========================
  describe("PATCH /cipok/:id", () => {
    test("admin módosítja a cipőt", async () => {
      const cipo = await db.Cipo.create({
        ar: 22990,
        nev: "Zoom Freak",
        marka: "Nike",
        tipus: "kosárcipő",
      });

      const res = await request(app)
        .patch(`/cipok/${cipo.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ ar: 25000 });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Cipő frissítve");

      const updated = await db.Cipo.findByPk(cipo.id);
      expect(updated.ar).toBe(25000);
    });
  });

  // =========================
  // DELETE
  // =========================
  describe("DELETE /cipok/:id", () => {
    test("admin törli a cipőt", async () => {
      const cipo = await db.Cipo.create({
        ar: 21000,
        nev: "Delete Me",
        marka: "Test",
        tipus: "utcai cipő",
      });

      const res = await request(app)
        .delete(`/cipok/${cipo.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Cipő törölve");

      const found = await db.Cipo.findByPk(cipo.id);
      expect(found).toBeNull();
    });
  });
});