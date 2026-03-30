const express = require("express");
const router = express.Router();

const cipoController = require("../controllers/cipoController");
const cipoFilter = require("../middlewares/cipoFilter");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");
// Publikus
/**
 * @swagger
 * /cipok:
 *   get:
 *     summary: Összes cipő lekérése
 *     tags: [Cipők]
 *     parameters:
 *       - in: query
 *         name: nev
 *         schema:
 *           type: string
 *         description: Cipő neve alapján szűrés
 *       - in: query
 *         name: marka
 *         schema:
 *           type: string
 *         description: Márka szerinti szűrés
 *       - in: query
 *         name: tipus
 *         schema:
 *           type: string
 *         description: Cipő típusa
 *       - in: query
 *         name: meret
 *         schema:
 *           type: integer
 *         description: Méret szerinti szűrés
 *       - in: query
 *         name: minAr
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxAr
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sikeres lekérés
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
 *                   marka:
 *                     type: string
 *                   ar:
 *                     type: integer
 *                   tipus:
 *                     type: string
 *                   meretek:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         meret:
 *                           type: integer
 *                   kepek:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 */
router.get("/", cipoFilter, cipoController.getCipok);

/**
 * @swagger
 * /cipok/{id}/kepek:
 *   post:
 *     summary: Képek hozzáadása egy cipőhöz (Admin)
 *     tags: [Cipők]
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
 *             required:
 *               - urls
 *             properties:
 *               urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["nike_air_zoom.png", "nike_air_zoom_2.png"]
 *     responses:
 *       201:
 *         description: Képek hozzáadva
 */
router.post("/:id/kepek", authenticate, isAdmin, cipoController.addCipoKep);
/**
 * @swagger
 * /cipok/{id}/meretek:
 *   post:
 *     summary: Méretek hozzáadása cipőhöz
 *     tags: [Cipők]
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
 *               meretek:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [38,39,40,41]
 *     responses:
 *       201:
 *         description: Méretek hozzáadva
 */
router.post("/:id/meretek", authenticate, isAdmin, cipoController.addCipoMeretek);

/**
 * @swagger
 * /cipok/{id}:
 *   get:
 *     summary: Cipő lekérése ID alapján
 *     tags: [Cipők]
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
 *         description: Cipő nem található
 */
router.get("/:id", cipoController.getCipo);

// Csak admin
/**
 * @swagger
 * /cipok:
 *   post:
 *     summary: Új cipő létrehozása (Admin)
 *     tags: [Cipők]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nev
 *               - marka
 *               - ar
 *             properties:
 *               nev:
 *                 type: string
 *                 example: Air Max 90
 *               marka:
 *                 type: string
 *                 example: Nike
 *               ar:
 *                 type: integer
 *                 example: 39990
 *     responses:
 *       201:
 *         description: Cipő létrehozva
 *       401:
 *         description: Nem hitelesített
 */
router.post("/", authenticate, isAdmin, cipoController.createCipo);
/**
 * @swagger
 * /cipok/{id}:
 *   patch:
 *     summary: Cipő módosítása (Admin)
 *     tags: [Cipők]
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
 *               nev:
 *                 type: string
 *               marka:
 *                 type: string
 *               ar:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sikeres módosítás
 *       401:
 *         description: Nem hitelesített
 *       404:
 *         description: Cipő nem található
 */
router.patch("/:id", authenticate, isAdmin, cipoController.updateCipo);
/**
 * @swagger
 * /cipok/{id}:
 *   delete:
 *     summary: Cipő törlése (Admin)
 *     tags: [Cipők]
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
 *       401:
 *         description: Nem hitelesített
 *       404:
 *         description: Cipő nem található
 */
router.delete("/:id", authenticate, isAdmin, cipoController.deleteCipo);


module.exports = router;
