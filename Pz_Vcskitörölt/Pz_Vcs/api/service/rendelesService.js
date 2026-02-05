const { BadRequestError, NotFoundError } = require("../errors");

class RendelesService {
    constructor(db) {
        // nem elég hogy a másik service-ekben leellenőriztük itt is le kell az összeset?!
        this.rendelesRepository = require("../repositories")(db).rendelesRepository;
        this.cipoRepository = require("../repositories")(db).cipoRepository;
        this.felhasznaloRepository = require("../repositories")(db).felhasznaloRepository;
    }

    
    async getRendelesek(filter={}) {
        return await this.rendelesRepository.getAll(filter);
    }

    
    async getRendeles(id) {
        if (!id) {
            throw new BadRequestError("Hiányzik a rendelés ID a kérésből", {
                data: { id },
            });
        }

        const rendeles = await this.rendelesRepository.getById(id);

        if (!rendeles) {
            throw new NotFoundError("A rendelés nem található az adatbázisban", {
                data: { id },
            });
        }

        return rendeles;
    }

    
    async createRendeles(adatok) {
        if (!adatok) {
            throw new BadRequestError("Hiányzik a rendelés adata", { data: adatok });
        }

        
        if (adatok.mennyiseg === undefined || adatok.mennyiseg === null) {
            throw new BadRequestError("Hiányzik a mennyiség", { data: adatok });
        }

        if (!adatok.allapot) {
            throw new BadRequestError("Hiányzik a rendelés állapota", { data: adatok });
        }

        if (!adatok.fizetes) {
            throw new BadRequestError("Hiányzik a fizetés módja", { data: adatok });
        }

        
        if (!adatok.FelhasznaloId) {
            throw new BadRequestError("Hiányzik a felhasználó azonosító (FelhasznaloId)", {
                data: adatok,
            });
        }

        if (!adatok.CipoId) {
            throw new BadRequestError("Hiányzik a cipő azonosító (CipoId)", {
                data: adatok,
            });
        }

        
        const user = await this.felhasznaloRepository.getById(adatok.FelhasznaloId);
        if (!user) {
            throw new NotFoundError("A megadott felhasználó nem létezik", {
                data: { FelhasznaloId: adatok.FelhasznaloId },
            });
        }

        
        const cipo = await this.cipoRepository.getById(adatok.CipoId);
        if (!cipo) {
            throw new NotFoundError("A megadott cipő nem található", {
                data: { CipoId: adatok.CipoId },
            });
        }

        
        if (adatok.mennyiseg <= 0) {
            throw new BadRequestError("A mennyiségnek pozitív számnak kell lennie", {
                data: adatok,
            });
        }

        return await this.rendelesRepository.create(adatok);
    }

    
    async updateRendeles(id, adatok) {
        if (!id) {
            throw new BadRequestError("Hiányzik a rendelés ID a módosításhoz", {
                data: { id },
            });
        }

        if (!adatok) {
            throw new BadRequestError("Hiányoznak a módosítandó adatok", {
                data: adatok,
            });
        }

        
        const rendeles = await this.rendelesRepository.getById(id);

        if (!rendeles) {
            throw new NotFoundError("A módosítandó rendelés nem található", {
                data: { id },
            });
        }

        
        if (adatok.mennyiseg !== undefined && adatok.mennyiseg <= 0) {
            throw new BadRequestError("A mennyiség nem lehet 0 vagy negatív", {
                data: adatok,
            });
        }

        return await this.rendelesRepository.update(id, adatok);
    }

    
    async deleteRendeles(id) {
        if (!id) {
            throw new BadRequestError("Hiányzik a rendelés ID a törléshez", {
                data: { id },
            });
        }

        const rendeles = await this.rendelesRepository.getById(id);

        if (!rendeles) {
            throw new NotFoundError("A törlendő rendelés nem található", {
                data: { id },
            });
        }

        return await this.rendelesRepository.delete(id);
    }
}

module.exports = RendelesService;
