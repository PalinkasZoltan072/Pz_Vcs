const { BadRequestError, NotFoundError } = require("../errors");

class RendelesService {
    constructor(db) {
        const repositories = require("../repositories")(db);
        this.rendelesRepository = repositories.rendelesRepository;
        this.cipoRepository = repositories.cipoRepository;
        this.felhasznaloRepository = repositories.felhasznaloRepository;
    }

    async getRendelesek(filter = {}, options = {}) {
        return await this.rendelesRepository.getAll(filter, options);
    }

    async getRendeles(id, options = {}) {
        if (!id) {
            throw new BadRequestError("Hiányzik a rendelés ID a kérésből", {
                data: { id },
            });
        }

        const rendeles = await this.rendelesRepository.getById(id, options);

        if (!rendeles) {
            throw new NotFoundError("A rendelés nem található az adatbázisban", {
                data: { id },
            });
        }

        return rendeles;
    }

    async createRendeles(adatok, options = {}) {
        if (!adatok)
            throw new BadRequestError("Hiányzik a rendelés adata", { data: adatok });

        if (adatok.mennyiseg === undefined || adatok.mennyiseg === null)
            throw new BadRequestError("Hiányzik a mennyiség", { data: adatok });

        if (!adatok.allapot)
            throw new BadRequestError("Hiányzik a rendelés állapota", { data: adatok });

        if (!adatok.fizetes)
            throw new BadRequestError("Hiányzik a fizetés módja", { data: adatok });

        if (!adatok.Felhasznalo_id)
            throw new BadRequestError("Hiányzik a felhasználó azonosító", { data: adatok });

        if (!adatok.Cipo_id)
            throw new BadRequestError("Hiányzik a cipő azonosító", { data: adatok });

        const user = await this.felhasznaloRepository.getById(adatok.Felhasznalo_id, options);
        if (!user)
            throw new NotFoundError("A megadott felhasználó nem létezik", {
                data: { Felhasznalo_id: adatok.Felhasznalo_id },
            });

        const cipo = await this.cipoRepository.getById(adatok.Cipo_id, options);
        if (!cipo)
            throw new NotFoundError("A megadott cipő nem található", {
                data: { Cipo_id: adatok.Cipo_id },
            });

        if (adatok.mennyiseg <= 0)
            throw new BadRequestError("A mennyiségnek pozitív számnak kell lennie", {
                data: adatok,
            });

        return await this.rendelesRepository.create(adatok, options);
    }

    async updateRendeles(id, adatok, options = {}) {
        if (!id)
            throw new BadRequestError("Hiányzik a rendelés ID a módosításhoz", {
                data: { id },
            });

        if (!adatok)
            throw new BadRequestError("Hiányoznak a módosítandó adatok", {
                data: adatok,
            });

        const rendeles = await this.rendelesRepository.getById(id, options);

        if (!rendeles)
            throw new NotFoundError("A módosítandó rendelés nem található", {
                data: { id },
            });

        if (adatok.mennyiseg !== undefined && adatok.mennyiseg <= 0)
            throw new BadRequestError("A mennyiség nem lehet 0 vagy negatív", {
                data: adatok,
            });

        return await this.rendelesRepository.update(id, adatok, options);
    }

    async deleteRendeles(id, options = {}) {
        if (!id)
            throw new BadRequestError("Hiányzik a rendelés ID a törléshez", {
                data: { id },
            });

        const rendeles = await this.rendelesRepository.getById(id, options);

        if (!rendeles)
            throw new NotFoundError("A törlendő rendelés nem található", {
                data: { id },
            });

        return await this.rendelesRepository.delete(id, options);
    }


async getCart(userId, options = {}) {
    return await this.rendelesRepository.getCartByUser(userId, options);
}

async addToCart(userId, cipoId, options = {}) {

    const existing = await this.rendelesRepository.getAll({
        Felhasznalo_id: userId,
        Cipo_id: cipoId,
        allapot: "kosár"
    }, options);

    if (existing.length > 0) {
        const item = existing[0];

        await this.rendelesRepository.update(item.id, {
            mennyiseg: item.mennyiseg + 1
        }, options);

        return { message: "Mennyiség növelve" };
    }

    return await this.rendelesRepository.create({
        Felhasznalo_id: userId,
        Cipo_id: cipoId,
        mennyiseg: 1,
        allapot: "kosár"
    }, options);
}
}

module.exports = RendelesService;