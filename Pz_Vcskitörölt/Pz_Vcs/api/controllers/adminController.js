const db = require("../db");
const { adminService } = require("../service")(db);

exports.getAdminok = async (req, res, next) => {
    try {
        res.status(200).json(await adminService.getAdminok());
    } catch (error) {
        next(error);
    }
}

exports.getAdmin = async (req, res, next) => {
    try {
        res.status(200).json(await adminService.getAdmin(req.params.id));
    } catch (error) {
        next(error);
    }
}

exports.createAdmin = async (req, res, next) => {
    try {
        res.status(201).json(await adminService.createAdmin(req.body));
    } catch (error) {
        next(error);
    }
}

exports.updateAdmin = async (req, res, next) => {
    try {
        await adminService.updateAdmin(req.params.id, req.body);
        res.status(200).json({ message: "Admin frissítve" });
    } catch (error) {
        next(error);
    }
}

exports.deleteAdmin = async (req, res, next) => {
    try {
        await adminService.deleteAdmin(req.params.id);
        res.status(200).json({ message: "Admin törölve" });
    } catch (error) {
        next(error);
    }
}
