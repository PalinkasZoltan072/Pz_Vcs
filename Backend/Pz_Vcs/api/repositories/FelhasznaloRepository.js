const { DbError } = require("../errors");

class FelhasznaloRepository {
    constructor(db) {
        this.Felhasznalo = db.Felhasznalo;
    }

    async getByEmail(email, options = {}) {
        try {
            return await this.Felhasznalo.findOne({
                where: { email },
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Felhasználó lekérése email alapján sikertelen", {
                details: error.message,
                data: { email },
            });
        }
    }

    async getByUsername(felhasznalonev, options = {}) {
        try {
            return await this.Felhasznalo.findOne({
                where: { felhasznalonev },
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Felhasználó lekérése felhasználónév alapján sikertelen", {
                details: error.message,
                data: { felhasznalonev },
            });
        }
    }

    async getAll(filter = {}, options = {}) {
        try {
            return await this.Felhasznalo.findAll({
                where: filter,
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Felhasználók lekérése sikertelen", {
                details: error.message,
            });
        }
    }

    async getById(id, options = {}) {
        try {
            return await this.Felhasznalo.findByPk(id, {
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Felhasználó lekérése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }

    async create(data, options = {}) {
        try {
            return await this.Felhasznalo.create(data, {
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Felhasználó létrehozása sikertelen", {
                details: error.message,
                data,
            });
        }
    }

    async update(id, data, options = {}) {
        try {
            return await this.Felhasznalo.update(data, {
                where: { id },
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Felhasználó frissítése sikertelen", {
                details: error.message,
                data: { id, ...data },
            });
        }
    }

    async delete(id, options = {}) {
        try {
            return await this.Felhasznalo.destroy({
                where: { id },
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Felhasználó törlése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }
}

module.exports = FelhasznaloRepository;