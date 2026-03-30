require("dotenv").config({
    path: "./.env.test",
    quiet: true,
  });
  
  process.env.NODE_ENV = "test";
  
  const request = require("supertest");
  const bcrypt = require("bcrypt");
  
  const  app  = require("../api/app");
  // console.log("APP TYPE:", typeof app);
  const db = require("../api/db");
  
  describe("Admin API - tranzakciós teszt", () => {
  
    let adminToken;
    let adminId;
  
    beforeAll(async () => {
      await db.sequelize.sync();
  
      // Kezdő admin létrehozása
      const admin = await db.Admin.create({
        felhasznalonev: "foadmin",
        email: "foadmin@test.hu",
        jelszo: bcrypt.hashSync("admin123", 10),
      });
  
      adminId = admin.id;
  
      const login = await request(app)
        .post("/adminok/login")
        .send({
          email: "foadmin@test.hu",
          jelszo: "admin123"
        });
  
      adminToken = login.body.token;
    });
  
    // =========================
    // LOGIN
    // =========================
    describe("POST /adminok/login", () => {
  
      test("sikeres login tokennel", async () => {
        const res = await request(app)
          .post("/adminok/login")
          .send({
            email: "foadmin@test.hu",
            jelszo: "admin123"
          });
  
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
      });
  
      test("400 ha hibás jelszó", async () => {
        const res = await request(app)
          .post("/adminok/login")
          .send({
            email: "foadmin@test.hu",
            jelszo: "rossz"
          });
  
        expect(res.status).toBe(400);
      });
  
      test("404 ha nem létező email", async () => {
        const res = await request(app)
          .post("/adminok/login")
          .send({
            email: "nincs@test.hu",
            jelszo: "123"
          });
  
        expect(res.status).toBe(404);
      });
  
    });
  
    // =========================
    // GET ALL
    // =========================
    describe("GET /adminok", () => {
  
      test("401 ha nincs token", async () => {
        const res = await request(app).get("/adminok");
        expect(res.status).toBe(401);
      });
  
      test("admin lekéri az adminokat", async () => {
        const res = await request(app)
          .get("/adminok")
          .set("Authorization", `Bearer ${adminToken}`);
  
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
      });
  
    });
  
    // =========================
    // GET BY ID
    // =========================
    describe("GET /adminok/:id", () => {
  
      test("admin lekér egy admint", async () => {
        const res = await request(app)
          .get(`/adminok/${adminId}`)
          .set("Authorization", `Bearer ${adminToken}`);
  
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(adminId);
      });
  
      test("404 ha nincs ilyen admin", async () => {
        const res = await request(app)
          .get("/adminok/999999")
          .set("Authorization", `Bearer ${adminToken}`);
  
        expect(res.status).toBe(404);
      });
  
    });
  
    // =========================
    // POST
    // =========================
    describe("POST /adminok", () => {

        test("401 ha nincs token", async () => {
          const res = await request(app)
            .post("/adminok")
            .send({
              felhasznalonev: "ujadmin",
              email: "uj@test.hu",
              jelszo: "123"
            });
      
          expect(res.status).toBe(401);
        });
      
        test("admin létrehozhat új admint", async () => {
      
          const res = await request(app)
            .post("/adminok")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
              felhasznalonev: "ujadmin",
              email: "ujadmin@test.hu",
              jelszo: "admin456"
            });
      
          expect(res.status).toBe(201);
      
          const found = await db.Admin.findOne({
            where: { email: "ujadmin@test.hu" }
          });
      
          expect(found).not.toBeNull();
        });
      
      });
  
    // =========================
    // PATCH
    // =========================
    describe("PATCH /adminok/:id", () => {
  
      test("401 ha nincs token", async () => {
        const res = await request(app)
          .patch(`/adminok/${adminId}`)
          .send({ felhasznalonev: "modositott" });
  
        expect(res.status).toBe(401);
      });
  
      test("admin módosítja az admint", async () => {
        const res = await request(app)
          .patch(`/adminok/${adminId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ felhasznalonev: "modositott" });
  
        expect(res.status).toBe(200);
  
        const updated = await db.Admin.findByPk(adminId);
        expect(updated.felhasznalonev).toBe("modositott");
      });
  
    });
  
    // =========================
    // DELETE
    // =========================
    describe("DELETE /adminok/:id", () => {
  
      test("admin törli az admint", async () => {
  
        const uj = await db.Admin.create({
          felhasznalonev: "torlendo",
          email: "torlendo@test.hu",
          jelszo: bcrypt.hashSync("123", 10)
        });
  
        const res = await request(app)
          .delete(`/adminok/${uj.id}`)
          .set("Authorization", `Bearer ${adminToken}`);
  
        expect(res.status).toBe(200);
  
        const deleted = await db.Admin.findByPk(uj.id);
        expect(deleted).toBeNull();
      });
  
    });
  
  });