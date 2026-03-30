const { DbError } = require("../errors");

class CipoRepository {
    constructor(db) {
        this.Cipo = db.Cipo;
        this.CipoMeret = db.CipoMeret;
        this.CipoKep = db.CipoKep

    }

    async getAll(filter = {}, options = {}) {
        try {
            return await this.Cipo.findAll({
                where: filter,
                include:[
                    {
                      model:this.CipoMeret,
                      as: "Meretek",
                      attributes:["meret"]
                    },
                    {
                      model:this.CipoKep,
                      as:"kepek",
                      attributes:["url"]
                    }
                  ],
             
            distinct: true,
            subQuery: false,
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Cipők lekérése sikertelen", {
                details: error.message,
            });
        }
    }

    async getById(id, options = {}) {
        try {
            return await this.Cipo.findByPk(id,{
                include:[
                    {
                       model:this.CipoMeret,
                       as:"Meretek",
                       attributes:["meret"]
                    },
                    {
                       model:this.CipoKep,
                       as:"kepek",
                       attributes:["url"]
                    }
                 ],
                transaction: options.transaction
            })
        } catch (error) {
            throw new DbError("Cipő lekérése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }
    async createCipoMeretek(data, options = {}) {
        try {
            return await this.CipoMeret.bulkCreate(data, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Cipő méretek létrehozása sikertelen", {
                details: error.message,
                data
            });
        }
    }
    async createCipoKepek(data, options = {}) {
        try {
            return await this.CipoKep.bulkCreate(data, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Cipő kép létrehozása sikertelen", {
                details: error.message,
                data
            });
        }
    }
    async create(data, options = {}) {
        try {
            return await this.Cipo.create(data, {
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Cipő létrehozása sikertelen", {
                details: error.message,
                data,
            });
        }
    }

    async update(id, data, options = {}) {
        try {
            return await this.Cipo.update(data, {
                where: { id },
                transaction: options.transaction,
            });
        } catch (error) {
            throw new DbError("Cipő frissítése sikertelen", {
                details: error.message,
                data: { id, ...data },
            });
        }
    }

    async delete(id, options = {}) {
        try {
            return await this.Cipo.destroy({
                where: { id },
                transaction: options.transaction,
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