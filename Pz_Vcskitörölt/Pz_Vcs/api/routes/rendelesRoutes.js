const express = require("express");
const router = express.Router();
const  {authenticate, isAdmin } = require("../middlewares/authMiddleware");
const rendelesFilter = require("../middlewares/rendelesFilter");
const rendelesController = require("../controllers/rendelesController");

/**
 * @swagger
 * tags:
 *   name: Rendelések
 *   description: Rendelések kezelése
 */

/**
 * @swagger
 * /rendelesek:
 *   get:
 *     summary: Összes rendelés lekérése (szűréssel)
 *     tags: [Rendelések]
 *     responses:
 *       200:
 *         description: Rendelések sikeresen lekérve
 */
router.get("/",authenticate,  rendelesFilter, rendelesController.getRendelesek);

/**
 * @swagger
 * /rendelesek/{id}:
 *   get:
 *     summary: Egy rendelés lekérése ID alapján
 *     tags: [Rendelések]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: A rendelés azonosítója
 *     responses:
 *       200:
 *         description: Rendelés sikeresen lekérve
 *       404:
 *         description: Rendelés nem található
 */
router.get("/:id",authenticate, rendelesController.getRendeles);

/**
 * @swagger
 * /rendelesek:
 *   post:
 *     summary: Új rendelés létrehozása
 *     tags: [Rendelések]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - felhasznaloId
 *               - cipoId
 *               - mennyiseg
 *             properties:
 *               felhasznaloId:
 *                 type: integer
 *               cipoId:
 *                 type: integer
 *               mennyiseg:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Rendelés sikeresen létrehozva
 *       400:
 *         description: Hibás adatok
 */
// user rendelhet de a többit csak admin csinalhat
router.post("/", authenticate, rendelesController.createRendeles);

/**
 * @swagger
 * /rendelesek/{id}:
 *   patch:
 *     summary: Rendelés módosítása
 *     tags: [Rendelések]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: A rendelés azonosítója
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mennyiseg:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rendelés sikeresen módosítva
 *       404:
 *         description: Rendelés nem található
 */
router.patch("/:id", authenticate, isAdmin, rendelesController.updateRendeles);
/**
 * @swagger
 * /rendelesek/{id}:
 *   delete:
 *     summary: Rendelés törlése
 *     tags: [Rendelések]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: A rendelés azonosítója
 *     responses:
 *       200:
 *         description: Rendelés sikeresen törölve
 *       404:
 *         description: Rendelés nem található
 */
router.delete("/:id", authenticate, isAdmin, rendelesController.deleteRendeles);
/**
 * @swagger
 * /rendelesek/kosar:
 *   get:
 *     summary: A bejelentkezett felhasználó kosarának lekérése
 *     tags: [Rendelések]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A kosár tartalma sikeresen lekérve
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   mennyiseg:
 *                     type: integer
 *                   meret:
 *                     type: integer
 *                   Cipo:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nev:
 *                         type: string
 *                       ar:
 *                         type: integer
 *                       marka:
 *                         type: string
 *       401:
 *         description: Nincs jogosultság
 */
router.get("/kosar", authenticate, rendelesController.getCart);
/**
 * @swagger
 * /rendelesek/kosar:
 *   post:
 *     summary: Termék hozzáadása a kosárhoz
 *     tags: [Rendelések]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cipoId
 *               - meret
 *               - mennyiseg
 *             properties:
 *               cipoId:
 *                 type: integer
 *                 description: A cipő azonosítója
 *               meret:
 *                 type: integer
 *                 description: A kiválasztott méret
 *               mennyiseg:
 *                 type: integer
 *                 description: A rendelni kívánt darabszám
 *     responses:
 *       200:
 *         description: Termék sikeresen hozzáadva a kosárhoz
 *       400:
 *         description: Hibás adatok
 *       401:
 *         description: Nincs jogosultság
 */
router.post("/kosar", authenticate, rendelesController.addToCart);

module.exports = router;
