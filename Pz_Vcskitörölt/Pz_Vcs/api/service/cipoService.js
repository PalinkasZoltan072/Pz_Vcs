const { BadRequestError, NotFoundError } = require("../errors");

class CipoService {
    constructor(db) {
        
        this.cipoRepository = require("../repositories")(db).cipoRepository;
    }

    
    async getCipok() {
        return await this.cipoRepository.getAll();
    }

    
    async getCipo(id) {
        if (!id) {
            throw new BadRequestError("Hiányzik a cipő azonosító (ID) a kérésből", {
                data: { id },
            });
        }

        const cipo = await this.cipoRepository.getById(id);

        if (!cipo) {
            throw new NotFoundError("A cipő nem található az adatbázisban", {
                data: { id },
            });
        }

        return cipo;
    }

    
    async createCipo(cipoData) {
        
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

        if (cipoData.meret === undefined || cipoData.meret === null) {
            throw new BadRequestError("Hiányzik a cipő mérete", { data: cipoData });
        }

        if (cipoData.ar === undefined || cipoData.ar === null) {
            throw new BadRequestError("Hiányzik a cipő ára", { data: cipoData });
        }

        if (!cipoData.tipus) {
            throw new BadRequestError("Hiányzik a cipő típusa", { data: cipoData });
        }

        

        return await this.cipoRepository.create(cipoData);
    }

    
    async updateCipo(id, adatok) {
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

        
        const cipo = await this.cipoRepository.getById(id);

        if (!cipo) {
            throw new NotFoundError("A módosítandó cipő nem található", {
                data: { id },
            });
        }

        // itt simán továbbadjuk az adatokat és a repository csinálja az update-et
        return await this.cipoRepository.update(id, adatok);
    }

    
    async deleteCipo(id) {
        if (!id) {
            throw new BadRequestError("Hiányzik a cipő azonosító (ID) a törléshez", {
                data: { id },
            });
        }

        const cipo = await this.cipoRepository.getById(id);

        if (!cipo) {
            throw new NotFoundError("A törlendő cipő nem található", {
                data: { id },
            });
        }

        return await this.cipoRepository.delete(id);
    }
}

module.exports = CipoService;
