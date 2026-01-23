const { DbError } = require("../errors");
//users alapjan csinaltamm
class FelhasznaloRepository {
    constructor(db) {
        this.Felhasznalo = db.Felhasznalo;
    }


    async getAll() { // összes user lekerese
        try {
            return await this.Felhasznalo.findAll();
        } catch (error) {
            throw new DbError("Felhasználók lekérése sikertelen", {
                details: error.message,
            });
        }
    }


    async getById(id) { //id alapjan felhasznalo lekerese ( lehet inkabb felhasznalo nev alapjan kéne?)
        try {
            return await this.Felhasznalo.findByPk(id);
        } catch (error) {
            throw new DbError("Felhasználó lekérése sikertelen", {
                details: error.message,
                data: { id },
            });
        }
    }

    
    async create(data) {
        try {
            return await this.Felhasznalo.create(data);
        } catch (error) {
            throw new DbError("Felhasználó létrehozása sikertelen", {
                details: error.message,
                data,
            });
        }
    }

   
    async update(id, data) {
        try {
            return await this.Felhasznalo.update(data, { //  a data tömböt amiben ugye az adataink vannak valtoztatja 
                where: { id }, // az adott id nál
            });
        } catch (error) {
            throw new DbError("Felhasználó frissítése sikertelen", {
                details: error.message,
                data: { id, ...data }, // ...data a data többi adatja ugye ez egy spread operator
            });
        }
    }

   
    async delete(id) {
        try {
            return await this.Felhasznalo.destroy({
                where: { id },
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
