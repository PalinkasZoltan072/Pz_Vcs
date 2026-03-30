require("dotenv").config({
    path: "./.env.test",
    quiet: true,
  });
  
  process.env.NODE_ENV = "test";
  //ezeket fedi le:
//   Admin-only lista
//  Saját profil vs más profil
//  Role ellenőrzés
//  Email duplikáció
//  Saját módosítás
//  Más módosítás tiltás
//  Saját törlés
//  Admin törlés
//  DB állapot ellenőrzés
  const request = require("supertest");
  const bcrypt = require("bcrypt");
  
  const  app  = require("../api/app");
  const db = require("../api/db");
  
  describe("Felhasználók API - tranzakciós teszt", () => {
  
    let adminToken;
    let user1Token;
    let user2Token;
  
    let user1Id;
    let user2Id;
  
    beforeAll(async () => {
      await db.sequelize.sync();
  
      // Admin létrehozása
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
        felhasznalonev: "nagyanita",
        email: "anita@test.hu",
        jelszo: bcrypt.hashSync("anita123", 10),
        telepules: "Debrecen",
        iranyitoszam: 4025,
      });
  
      user2Id = user2.id;
  
      const user2Login = await request(app)
        .post("/felhasznalok/login")
        .send({ email: "anita@test.hu", jelszo: "anita123" });
  
      user2Token = user2Login.body.token;
    });
  
    // =========================
    // GET ALL (ADMIN)
    // =========================
    describe("GET /felhasznalok", () => {
  
      test("401 ha nincs token", async () => {
        const res = await request(app).get("/felhasznalok");
        expect(res.status).toBe(401);
      });
  
      test("401 ha nem admin", async () => {
        const res = await request(app)
          .get("/felhasznalok")
          .set("Authorization", `Bearer ${user1Token}`);
  
        expect(res.status).toBe(401);
      });
  
      test("admin lekéri az összes felhasználót", async () => {
        const res = await request(app)
          .get("/felhasznalok")
          .set("Authorization", `Bearer ${adminToken}`);
  
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
      });
  
    });
  
    // =========================
    // GET BY ID
    // =========================
    describe("GET /felhasznalok/:id", () => {
  
      test("user lekérheti saját magát", async () => {
        const res = await request(app)
          .get(`/felhasznalok/${user1Id}`)
          .set("Authorization", `Bearer ${user1Token}`);
  
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(user1Id);
      });
  
      test("user nem kérheti le más adatait", async () => {
        const res = await request(app)
          .get(`/felhasznalok/${user1Id}`)
          .set("Authorization", `Bearer ${user2Token}`);
  
        expect(res.status).toBe(401);
      });
  
      test("admin lekérhet bárkit", async () => {
        const res = await request(app)
          .get(`/felhasznalok/${user1Id}`)
          .set("Authorization", `Bearer ${adminToken}`);
  
        expect(res.status).toBe(200);
      });
  
    });
  
    // =========================
    // POST
    // =========================
    describe("POST /felhasznalok", () => {
  
      test("létrehoz egy új felhasználót", async () => {
  
        const uj = {
          felhasznalonev: "kovacsbela",
          email: "bela@test.hu",
          jelszo: "bela123",
          telepules: "Győr",
          iranyitoszam: 9021
        };
  
        const res = await request(app)
          .post("/felhasznalok")
          .send(uj);
  
        expect(res.status).toBe(201);
        expect(res.body.felhasznalonev).toBe("kovacsbela");
  
        const found = await db.Felhasznalo.findOne({
          where: { email: "bela@test.hu" }
        });
  
        expect(found).not.toBeNull();
      });
  
      test("400 ha email már létezik", async () => {
        const res = await request(app)
          .post("/felhasznalok")
          .send({
            felhasznalonev: "ujnev",
            email: "kiss@test.hu",
            jelszo: "123",
            telepules: "Test",
            iranyitoszam: 1111
          });
  
        expect(res.status).toBe(400);
      });
  
    });
  
    // =========================
    // PATCH
    // =========================
    describe("PATCH /felhasznalok/:id", () => {
  
      test("user módosíthatja saját magát", async () => {
        const res = await request(app)
          .patch(`/felhasznalok/${user1Id}`)
          .set("Authorization", `Bearer ${user1Token}`)
          .send({ telepules: "Budapest" });
  
        expect(res.status).toBe(200);
  
        const updated = await db.Felhasznalo.findByPk(user1Id);
        expect(updated.telepules).toBe("Budapest");
      });
  
      test("user nem módosíthat mást", async () => {
        const res = await request(app)
          .patch(`/felhasznalok/${user1Id}`)
          .set("Authorization", `Bearer ${user2Token}`)
          .send({ telepules: "Pécs" });
  
        expect(res.status).toBe(401);
      });
  
    });
  
    // =========================
    // DELETE
    // =========================
    describe("DELETE /felhasznalok/:id", () => {
  
      test("user törölheti saját magát", async () => {
        const res = await request(app)
          .delete(`/felhasznalok/${user2Id}`)
          .set("Authorization", `Bearer ${user2Token}`);
  
        expect(res.status).toBe(200);
  
        const deleted = await db.Felhasznalo.findByPk(user2Id);
        expect(deleted).toBeNull();
      });
  
      test("admin törölhet bárkit", async () => {
        const res = await request(app)
          .delete(`/felhasznalok/${user1Id}`)
          .set("Authorization", `Bearer ${adminToken}`);
  
        expect(res.status).toBe(200);
  
        const deleted = await db.Felhasznalo.findByPk(user1Id);
        expect(deleted).toBeNull();
      });
  
    });
  
  });