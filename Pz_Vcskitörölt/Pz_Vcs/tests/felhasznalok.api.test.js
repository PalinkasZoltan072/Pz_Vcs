jest.mock("../api/db");
const request = require("supertest");
const app = require("../api/app");
const db = require("../api/db");

describe("Felhasználók API /felhasznalok", () => {

    const felhasznalok = [
        {
            felhasznalonev: "kisspeter",
            email: "kiss.peter@gmail.com",
            jelszo: "peter123",
            telepules: "Szeged",
            iranyitoszam: 6720
        },
        {
            felhasznalonev: "nagyanita",
            email: "nagyanita@gmail.com",
            jelszo: "anita321",
            telepules: "Debrecen",
            iranyitoszam: 4025
        }
    ];
    beforeAll(async () => {
        // Mock DB-ben sqlite-memory van, itt létrejönnek a táblák
        await db.sequelize.sync();
      });
    beforeEach(async () => {
        await db.Felhasznalo.bulkCreate(felhasznalok);
    });

    afterEach(async () => {
        await db.Felhasznalo.destroy({ where: {} });
    });

    describe("GET /felhasznalok", () => {
        test("visszaadja az összes felhasználót", async () => {
            const res = await request(app)
                .get("/felhasznalok")
                .set("Accept", "application/json");

            expect(res.status).toBe(200);
            expect(res.type).toMatch(/json/);
            expect(res.body.length).toBe(2);
        });
    });

    describe("GET /felhasznalok/:id", () => {
        test("visszaad egy felhasználót id alapján", async () => {
            const user = await db.Felhasznalo.findOne({
                where: { felhasznalonev: "kisspeter" }
            });

            const res = await request(app).get(`/felhasznalok/${user.id}`);

            expect(res.status).toBe(200);
            expect(res.body.felhasznalonev).toBe("kisspeter");
            expect(res.body.telepules).toBe("Szeged");
        });
    });

    describe("POST /felhasznalok", () => {
        test("létrehoz egy új felhasználót", async () => {
            const ujFelhasznalo = {
                felhasznalonev: "kovacsbela",
                email: "kovacs.bela@gmail.com",
                jelszo: "bela456",
                telepules: "Győr",
                iranyitoszam: 9021
            };

            const res = await request(app)
                .post("/felhasznalok")
                .send(ujFelhasznalo);

            expect(res.status).toBe(201);
            expect(res.body.felhasznalonev).toBe("kovacsbela");

            const found = await db.Felhasznalo.findOne({
                where: { felhasznalonev: "kovacsbela" }
            });

            expect(found).toBeDefined();
        });
    });

    describe("DELETE /felhasznalok/:id", () => {
        test("töröl egy felhasználót", async () => {
            const user = await db.Felhasznalo.findOne({
                where: { felhasznalonev: "nagyanita" }
            });

            const res = await request(app).delete(`/felhasznalok/${user.id}`);

            expect(res.status).toBe(200);

            const deleted = await db.Felhasznalo.findByPk(user.id);
            expect(deleted).toBeNull();
        });
    });
});
