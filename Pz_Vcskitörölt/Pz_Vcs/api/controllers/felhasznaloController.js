const db = require("../db");
const { felhasznaloService } = require("../service")(db);

// GET /felhasznalok
exports.getFelhasznalok = async (req, res, next) => {
    try {
        res.status(200).json(await felhasznaloService.getFelhasznalok());
    } catch (error) {
        next(error);
    }
}

// GET /felhasznalok/:id
exports.getFelhasznalo = async (req, res, next) => {
    try {
        res.status(200).json(await felhasznaloService.getFelhasznalo(req.params.id));
    } catch (error) {
        next(error);
    }
}

// POST /felhasznalok
exports.createFelhasznalo = async (req, res, next) => {
    try {
        res.status(201).json(await felhasznaloService.createFelhasznalo(req.body));
    } catch (error) {
        next(error);
    }
}

// PUT /felhasznalok/:id
exports.updateFelhasznalo = async (req, res, next) => {
    try {
        await felhasznaloService.updateFelhasznalo(req.params.id, req.body);
        res.status(200).json({ message: "Felhasználó frissítve" });
    } catch (error) {
        next(error);
    }
}

// DELETE /felhasznalok/:id
exports.deleteFelhasznalo = async (req, res, next) => {
    try {
        await felhasznaloService.deleteFelhasznalo(req.params.id);
        res.status(200).json({ message: "Felhasználó törölve" });
    } catch (error) {
        next(error);
    }
}
