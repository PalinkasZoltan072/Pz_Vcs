const db = require("../db");
const { cipoService } = require("../service")(db);

exports.getCipok = async (req, res, next) => {
    try {
        const filter = req.cipoFilter || {};
        res.status(200).json(await cipoService.getCipok(filter));
    } catch (error) {
        next(error);
    }
}

exports.getCipo = async (req, res, next) => {
    try {
        res.status(200).json(await cipoService.getCipo(req.params.id));
    } catch (error) {
        next(error);
    }
}

exports.createCipo = async (req, res, next) => {
    try {
        res.status(201).json(await cipoService.createCipo(req.body));
    } catch (error) {
        next(error);
    }
}

exports.updateCipo = async (req, res, next) => {
    try {
        await cipoService.updateCipo(req.params.id, req.body);
        res.status(200).json({ message: "Cipő frissítve" });
    } catch (error) {
        next(error);
    }
}

exports.deleteCipo = async (req, res, next) => {
    try {
        await cipoService.deleteCipo(req.params.id);
        res.status(200).json({ message: "Cipő törölve" });
    } catch (error) {
        next(error);
    }
}
