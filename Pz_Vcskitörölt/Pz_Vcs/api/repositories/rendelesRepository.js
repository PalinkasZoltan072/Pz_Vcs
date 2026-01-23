const { DbError } = require("../errors");

class RendelesRepository {
    constructor(db) {
        
        this.Rendeles = db.Rendeles;
    }

    
    async getAll() {
        try {
            return await this.Rendeles.findAll();
        } catch (error) {
            throw new DbError("Rendelések lekérése sikertelen", {
                details: error.message,
            });
        }
    }

    
    async getById(id) {
        try {
            return await this.Rendeles.findByPk(id);
        } catch (error) {
            throw new DbError("Rendelés lekérése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }

    
    async create(data) {
        try {
            
            return await this.Rendeles.create(data);
        } catch (error) {
            throw new DbError("Rendelés létrehozása sikertelen", {
                details: error.message,
                data,
            });
        }
    }

    
    async update(id, data) {
        try {
            
            return await this.Rendeles.update(data, {
                where: { id },
            });
        } catch (error) {
            throw new DbError("Rendelés frissítése sikertelen", {
                details: error.message,
                data: { id, ...data },
            });
        }
    }

    
    async delete(id) {
        try {
            return await this.Rendeles.destroy({
                where: { id },
            });
        } catch (error) {
            throw new DbError("Rendelés törlése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }
}

module.exports = RendelesRepository;
