const db = require("../db");
const { felhasznaloService } = require("../service")(db);
const { UnauthorizedError } = require("../errors");

exports.login = async (req, res, next) => {
    try {
        const { email, jelszo } = req.body;
        const result = await felhasznaloService.login(email, jelszo);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


exports.getFelhasznalok = async (req, res, next) => {
    try {
        const filter = req.felhasznaloFilter || {};

        res.status(200).json(
            await felhasznaloService.getFelhasznalok(filter, {
                transaction: req.transaction,
            })
        );
    } catch (error) {
        next(error);
    }
};

exports.getFelhasznalo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (req.user.role !== "admin" && req.user.id !== id) {
            throw new UnauthorizedError(
                "Nincs jogosultság más felhasználó adatainak megtekintéséhez"
            );
        }

        res.status(200).json(
            await felhasznaloService.getFelhasznalo(id, {
                transaction: req.transaction,
            })
        );
    } catch (error) {
        next(error);
    }
};


exports.createFelhasznalo = async (req, res, next) => {
    try {
        const result = await felhasznaloService.createFelhasznalo(req.body, {
            transaction: req.transaction,
        });

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};


exports.updateFelhasznalo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (req.user.role !== "admin" && req.user.id !== id) {
            throw new UnauthorizedError(
                "Nincs jogosultság más felhasználó módosításához"
            );
        }

        await felhasznaloService.updateFelhasznalo(id, req.body, {
            transaction: req.transaction,
        });

        res.status(200).json({ message: "Felhasználó frissítve" });
    } catch (error) {
        next(error);
    }
};


exports.deleteFelhasznalo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (req.user.role !== "admin" && req.user.id !== id) { 
            throw new UnauthorizedError(
                "Nincs jogosultság más felhasználó törléséhez"
            );
        }

        await felhasznaloService.deleteFelhasznalo(id, {
            transaction: req.transaction,
        });

        res.status(200).json({ message: "Felhasználó törölve" });
    } catch (error) {
        next(error);
    }
};