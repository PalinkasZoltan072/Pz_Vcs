const { BadRequestError, NotFoundError } = require("../errors");

class CipoService {
    constructor(db) {
        this.cipoRepository = require("../repositories")(db).cipoRepository;
    }

    async getCipok(filter = {}, options = {}) {
        return await this.cipoRepository.getAll(filter, options);
    }

    async getCipo(id, options = {}) {
        if (!id) {
            throw new BadRequestError("Hiányzik a cipő azonosító (ID) a kérésből", {
                data: { id },
            });
        }

        const cipo = await this.cipoRepository.getById(id, options);

        if (!cipo) {
            throw new NotFoundError("A cipő nem található az adatbázisban", {
                data: { id },
            });
        }

        return cipo;
    }
    async addCipoKepek(cipoId, urls, options = {}) {

        if (!urls || urls.length === 0) {
            throw new BadRequestError("Nincsenek képek megadva");
        }
    
        const cipo = await this.cipoRepository.getById(cipoId, options);
    
        if (!cipo) {
            throw new NotFoundError("Cipő nem található");
        }
    
        const rows = urls.map(u => ({
            cipo_id: cipoId,
            url: u
        }));
    
        return await this.cipoRepository.createCipoKepek(rows, options);
    }
    async addCipoMeretek(cipoId, meretek, options = {}) {

        if (!cipoId) {
            throw new BadRequestError("Hiányzik a cipő azonosító (ID)", {
                data: { cipoId }
            });
        }
    
        if (!meretek || meretek.length === 0) {
            throw new BadRequestError("Nincsenek méretek megadva", {
                data: { meretek }
            });
        }
    
        const cipo = await this.cipoRepository.getById(cipoId, options);
    
        if (!cipo) {
            throw new NotFoundError("Cipő nem található", {
                data: { cipoId }
            });
        }
    
        const rows = meretek.map(m => ({
            cipo_id: cipoId,
            meret: m
        }));
    
        try {
    
            return await this.cipoRepository.createCipoMeretek(rows, options);
    
        } catch (error) {
    
            throw new DbError("Cipő méretek létrehozása sikertelen", {
                details: error.message,
                data: rows
            });
    
        }
    }
    async createCipo(cipoData, options = {}) {
        if (!cipoData) {
            throw new BadRequestError("Hiányzik a cipő adata a kérésből", {
                data: cipoData,
            });
        }

        if (!cipoData.nev) {
            throw new BadRequestError("Hiányzik a cipő neve", { data: cipoData });
        }

        if (!cipoData.marka) {
            throw new BadRequestError("Hiányzik a cipő márkája", { data: cipoData });
        }

        

        if (cipoData.ar === undefined || cipoData.ar === null) {
            throw new BadRequestError("Hiányzik a cipő ára", { data: cipoData });
        }

        if (!cipoData.tipus) {
            throw new BadRequestError("Hiányzik a cipő típusa", { data: cipoData });
        }

        return await this.cipoRepository.create(cipoData, options);
    }

    async updateCipo(id, adatok, options = {}) {
        if (!id) {
            throw new BadRequestError("Hiányzik a cipő azonosító (ID) a módosításhoz", {
                data: { id },
            });
        }

        if (!adatok) {
            throw new BadRequestError("Hiányoznak a módosítandó adatok", {
                data: adatok,
            });
        }

        const cipo = await this.cipoRepository.getById(id, options);

        if (!cipo) {
            throw new NotFoundError("A módosítandó cipő nem található", {
                data: { id },
            });
        }

        return await this.cipoRepository.update(id, adatok, options);
    }

    async deleteCipo(id, options = {}) {
        if (!id) {
            throw new BadRequestError("Hiányzik a cipő azonosító (ID) a törléshez", {
                data: { id },
            });
        }

        const cipo = await this.cipoRepository.getById(id, options);

        if (!cipo) {
            throw new NotFoundError("A törlendő cipő nem található", {
                data: { id },
            });
        }

        return await this.cipoRepository.delete(id, options);
    }
}

module.exports = CipoService;