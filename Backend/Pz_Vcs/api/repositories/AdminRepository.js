const { DbError } = require("../errors");

class AdminRepository {
    constructor(db) {
        this.Admin = db.Admin;
    }

    async getByEmail(email, options = {}) {
        try {
            return await this.Admin.findOne({
                where: { email },
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Admin lekérése email alapján sikertelen", {
                details: error.message,
                data: { email },
            });
        }
    }

    async getAll(options = {}) {
        try {
            return await this.Admin.findAll({
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Adminok lekérése sikertelen", {
                details: error.message,
            });
        }
    }

    async getById(id, options = {}) {
        try {
            return await this.Admin.findByPk(id, {
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Admin lekérése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }

    async create(data, options = {}) {
        try {
            return await this.Admin.create(data, {
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Admin létrehozása sikertelen", {
                details: error.message,
                data,
            });
        }
    }

    async update(id, data, options = {}) {
        try {
            return await this.Admin.update(data, {
                where: { id },
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Admin frissítése sikertelen", {
                details: error.message,
                data: { id, ...data },
            });
        }
    }

    async delete(id, options = {}) {
        try {
            return await this.Admin.destroy({
                where: { id },
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Admin törlése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }
}

module.exports = AdminRepository;