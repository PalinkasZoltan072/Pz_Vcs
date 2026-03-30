const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");
const felhasznaloFilter = require("../middlewares/felhasznaloFilter");
const felhasznaloController = require("../controllers/felhasznaloController");
/**
 * @swagger
 * /felhasznalok:
 *   get:
 *     summary: Összes felhasználó lekérése
 *     tags: [Felhasználók]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sikeres lekérés
 *       401:
 *         description: Nem hitelesített
 */
router.get("/", authenticate, isAdmin, felhasznaloFilter, felhasznaloController.getFelhasznalok);

/**
 * @swagger
 * /felhasznalok/{id}:
 *   get:
 *     summary: Felhasználó lekérése ID alapján
 *     tags: [Felhasználók]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sikeres lekérés
 *       404:
 *         description: Nem található
 */
router.get("/:id", authenticate, felhasznaloController.getFelhasznalo)
/**
 * @swagger
 * /felhasznalok:
 *   post:
 *     summary: Új felhasználó regisztráció
 *     tags: [Felhasználók]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - felhasznalonev
 *               - jelszo
 *               - telepules
 *               - iranyitoszam
 *             properties:
 *               email:
 *                 type: string
 *                 example: teszt@email.com
 *               felhasznalonev:
 *                 type: string
 *                 example: tesztuser
 *               jelszo:
 *                 type: string
 *                 example: Teszt123!
 *               telepules:
 *                 type: string
 *                 example: Budapest
 *               iranyitoszam:
 *                 type: integer
 *                 example: 1111
 *     responses:
 *       201:
 *         description: Felhasználó létrehozva
 *       400:
 *         description: Hibás adat vagy már létező email
 */
router.post("/", felhasznaloController.createFelhasznalo);

/**
 * @swagger
 * /felhasznalok/{id}:
 *   patch:
 *     summary: Felhasználó adatainak módosítása
 *     tags: [Felhasználók]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               felhasznalonev:
 *                 type: string
 *                 example: ujnev
 *               jelszo:
 *                 type: string
 *                 example: UjJelszo123!
 *               telepules:
 *                 type: string
 *                 example: Debrecen
 *               iranyitoszam:
 *                 type: integer
 *                 example: 4024
 *     responses:
 *       200:
 *         description: Sikeres frissítés
 *       400:
 *         description: Hibás adat
 *       404:
 *         description: Felhasználó nem található
 *       401:
 *         description: Nem hitelesített
 */
router.patch("/:id",authenticate, felhasznaloController.updateFelhasznalo);
/**
 * @swagger
 * /felhasznalok/{id}:
 *   delete:
 *     summary: Felhasználó törlése
 *     tags: [Felhasználók]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sikeres törlés
 *       404:
 *         description: Felhasználó nem található
 *       401:
 *         description: Nem hitelesített
 */
router.delete("/:id",authenticate, felhasznaloController.deleteFelhasznalo);
/**
 * @swagger
 * /felhasznalok/login:
 *   post:
 *     summary: Felhasználó bejelentkezés
 *     tags: [Felhasználók]
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
 *                 example: teszt@email.com
 *               jelszo:
 *                 type: string
 *                 example: Teszt123!
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
 *         description: Felhasználó nem található
 */
router.post("/login", felhasznaloController.login);
module.exports = router;
