const { DbError } = require("../errors");

class CipoRepository {
    constructor(db) {
        // Itt kapjuk meg a Sequelize modelt (db-ből, pl. index.js-ből):
        this.Cipo = db.Cipo;
    }

    
    async getAll() {
        try {
            return await this.Cipo.findAll();
        } catch (error) {
            throw new DbError("Cipők lekérése sikertelen", {
                details: error.message,
            });
        }
    }

    
    async getById(id) {
        try {
            return await this.Cipo.findByPk(id);
        } catch (error) {
            throw new DbError("Cipő lekérése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }

    
    async create(data) {
        try {
            return await this.Cipo.create(data);
        } catch (error) {
            throw new DbError("Cipő létrehozása sikertelen", {
                details: error.message,
                data,
            });
        }
    }

    
    async update(id, data) {
        try {
            return await this.Cipo.update(data, {
                where: { id },
            });
        } catch (error) {
            throw new DbError("Cipő frissítése sikertelen", {
                details: error.message,
                data: { id, ...data },
            });
        }
    }

    
    async delete(id) {
        try {
            return await this.Cipo.destroy({
                where: { id },
            });
        } catch (error) {
            throw new DbError("Cipő törlése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }
}

module.exports = CipoRepository;
