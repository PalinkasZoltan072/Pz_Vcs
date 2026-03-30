const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");
/**
 * @swagger
 * tags:
 *   name: Adminok
 *   description: Admin felhasználók kezelése
 */

/**
 * @swagger
 * /adminok:
 *   get:
 *     summary: Összes admin lekérése
 *     tags: [Adminok]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Adminok sikeresen lekérve
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nev:
 *                     type: string
 *                   email:
 *                     type: string
 *             example:
 *               - id: 1
 *                 nev: "Kiss Péter"
 *                 email: "admin1@email.com"
 *               - id: 2
 *                 nev: "Nagy Anna"
 *                 email: "admin2@email.com"
 */
router.get("/",authenticate,isAdmin, adminController.getAdminok);
/**
 * @swagger
 * /adminok/{id}:
 *   get:
 *     summary: Egy admin lekérése ID alapján
 *     tags: [Adminok]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Az admin azonosítója
 *     responses:
 *       200:
 *         description: Admin sikeresen lekérve
 *       404:
 *         description: Admin nem található
 */
router.get("/:id",authenticate,isAdmin, adminController.getAdmin);
/**
 * @swagger
 * /adminok:
 *   post:
 *     summary: Új admin létrehozása
 *     tags: [Adminok]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nev
 *               - email
 *               - password
 *             properties:
 *               nev:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             nev: "Teszt Admin"
 *             email: "teszt@email.com"
 *             password: "123456"
 *     responses:
 *       201:
 *         description: Admin sikeresen létrehozva
 *       400:
 *         description: Hibás adatok
 */
router.post("/",authenticate, isAdmin, adminController.createAdmin);// itt elvileg nem kéne? hiszen ha uj admint akarunk létrehozni az tuti nem lesz admin kezdésként amíg nem jön létre
/**
 * @swagger
 * /adminok/{id}:
 *   patch:
 *     summary: Admin módosítása
 *     tags: [Adminok]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Az admin azonosítója
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nev:
 *                 type: string
 *               email:
 *                 type: string
 *           example:
 *             nev: "Módosított Név"
 *             email: "uj@email.com"
 *     responses:
 *       200:
 *         description: Admin sikeresen módosítva
 *       404:
 *         description: Admin nem található
 */
router.patch("/:id",authenticate,isAdmin, adminController.updateAdmin);
/**
 * @swagger
 * /adminok/{id}:
 *   delete:
 *     summary: Admin törlése
 *     tags: [Adminok]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Az admin azonosítója
 *     responses:
 *       200:
 *         description: Admin sikeresen törölve
 *       404:
 *         description: Admin nem található
 */
router.delete("/:id",authenticate,isAdmin, adminController.deleteAdmin);
// a security : [] az azert hogy a user jelszava ne legyen haselve mivel a configban az összesre be van allitva hash
/**
 * @swagger
 * /adminok/login:
 *   post:
 *     summary: Admin bejelentkezés
 *     tags: [Adminok]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - jelszo
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@email.com
 *               jelszo:
 *                 type: string
 *                 example: Admin123!
 *     responses:
 *       200:
 *         description: Sikeres bejelentkezés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Hibás jelszó
 *       404:
 *         description: Admin nem található
 */
// router.post("/login",authenticate, isAdmin, adminController.login); elv ide nem kell 
router.post("/login", adminController.login);
module.exports = router;
