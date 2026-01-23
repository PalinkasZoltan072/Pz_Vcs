const { DbError } = require("../errors");


class adminRepository {
    constructor(db) {
        // Itt kapjuk meg a Sequelize modelt (db-ből, pl. index.js-ből):
        this.Admin = db.Admin;
    }

    
    async getAll() {
        try {
            return await this.Admin.findAll();
        } catch (error) {
            throw new DbError("Adminok lekérése sikertelen", {
                details: error.message,
            });
        }
    }

    
    async getById(id) {
        try {
            return await this.Admin.findByPk(id);
        } catch (error) {
            throw new DbError("Admin lekérése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }

    
    async create(data) {
        try {
            return await this.Admin.create(data);
        } catch (error) {
            throw new DbError("Admin létrehozása sikertelen", {
                details: error.message,
                data,
            });
        }
    }

    
    async update(id, data) {
        try {
            return await this.Admin.update(data, {
                where: { id },
            });
        } catch (error) {
            throw new DbError("Admin frissítése sikertelen", {
                details: error.message,
                data: { id, ...data },
            });
        }
    }

    
    async delete(id) {
        try {
            return await this.Admin.destroy({
                where: { id },
            });
        } catch (error) {
            throw new DbError("Admin törlése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }
}
module.exports = adminRepository;