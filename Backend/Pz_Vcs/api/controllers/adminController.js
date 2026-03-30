const db = require("../db");
const { adminService } = require("../service")(db);

exports.login = async (req, res, next) => {
    try {
        const { email, jelszo } = req.body;
        const result = await adminService.login(email, jelszo);
        res.status(200).json(result);
    } catch (error) {
        console.log("LOGIN ERROR:", error);
        next(error);
    }
};

exports.getAdminok = async (req, res, next) => {
    try {
        res.status(200).json(
            await adminService.getAdminok({
                transaction: req.transaction,
            })
        );
    } catch (error) {
        next(error);
    }
};

exports.getAdmin = async (req, res, next) => {
    try {
        res.status(200).json(
            await adminService.getAdmin(req.params.id, {
                transaction: req.transaction,
            })
        );
    } catch (error) {
        next(error);
    }
};

exports.createAdmin = async (req, res, next) => {
    try {
        const result = await adminService.createAdmin(req.body, {
            transaction: req.transaction,
        });

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

exports.updateAdmin = async (req, res, next) => {
    try {
        await adminService.updateAdmin(req.params.id, req.body, {
            transaction: req.transaction,
        });

        res.status(200).json({ message: "Admin frissítve" });
    } catch (error) {
        next(error);
    }
};

exports.deleteAdmin = async (req, res, next) => {
    try {
        await adminService.deleteAdmin(req.params.id, {
            transaction: req.transaction,
        });

        res.status(200).json({ message: "Admin törölve" });
    } catch (error) {
        next(error);
    }
};