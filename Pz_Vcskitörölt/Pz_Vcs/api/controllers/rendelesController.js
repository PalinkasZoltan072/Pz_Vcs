const db = require("../db");
const { rendelesService } = require("../service")(db);

exports.getRendelesek = async (req, res, next) => {
    try {
        res.status(200).json(await rendelesService.getRendelesek());
    } catch (error) {
        next(error);
    }
}

exports.getRendeles = async (req, res, next) => {
    try {
        res.status(200).json(await rendelesService.getRendeles(req.params.id));
    } catch (error) {
        next(error);
    }
}

exports.createRendeles = async (req, res, next) => {
    try {
        res.status(201).json(await rendelesService.createRendeles(req.body));
    } catch (error) {
        next(error);
    }
}

exports.updateRendeles = async (req, res, next) => {
    try {
        await rendelesService.updateRendeles(req.params.id, req.body);
        res.status(200).json({ message: "Rendelés frissítve" });
    } catch (error) {
        next(error);
    }
}

exports.deleteRendeles = async (req, res, next) => {
    try {
        await rendelesService.deleteRendeles(req.params.id);
        res.status(200).json({ message: "Rendelés törölve" });
    } catch (error) {
        next(error);
    }
}
