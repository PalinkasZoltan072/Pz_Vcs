const { DbError } = require("../errors");

class RendelesRepository {
    constructor(db) {
        this.Rendeles = db.Rendeles;

        
        
        
        this.Cipo = db.Cipo;
        this.CipoKep = db.CipoKep;
        this.CipoMeret = db.CipoMeret;
    }

    async getAll(filter = {}, options = {}) {
        try {
            return await this.Rendeles.findAll({
                where: filter,
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Rendelések lekérése sikertelen", {
                details: error.message,
            });
        }
    }

    async getById(id, options = {}) {
        try {
            return await this.Rendeles.findByPk(id, {
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Rendelés lekérése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }

    async create(data, options = {}) {
        try {
            return await this.Rendeles.create(data, {
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Rendelés létrehozása sikertelen", {
                details: error.message,
                data,
            });
        }
    }

    async update(id, data, options = {}) {
        try {
            return await this.Rendeles.update(data, {
                where: { id },
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Rendelés frissítése sikertelen", {
                details: error.message,
                data: { id, ...data },
            });
        }
    }

    async delete(id, options = {}) {
        try {
            return await this.Rendeles.destroy({
                where: { id },
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Rendelés törlése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }

    
    async getCartByUser(userId, options = {}) {
        try {
            return await this.Rendeles.findAll({
                where: {
                    Felhasznalo_id: userId,
                    allapot: "kosár",
                },
                include: [
                    {
                        model: this.Cipo,
                        include: [
                            {
                                model: this.CipoKep,
                                attributes: ["url"],
                            },
                            {
                                model: this.CipoMeret,
                                attributes: ["meret"],
                            },
                        ],
                    },
                ],
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Kosár lekérése sikertelen", {
                details: error.message,
                data: { userId },
            });
        }
    }
}

module.exports = RendelesRepository;