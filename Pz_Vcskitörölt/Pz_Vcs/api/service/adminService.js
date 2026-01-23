const { BadRequestError, NotFoundError } = require("../errors");

class adminService {
    constructor(db) {
        
        this.adminRepository = require("../repositories")(db).adminRepository;
    }

    
    async getAdminok() {
        return await this.adminRepository.getAll();
    }

    
    async getAdmin(id) {
        if (!id) {
            throw new BadRequestError("Hiányzik a Admin azonosító (ID) a kérésből", {
                data: { id },
            });
        }

        const admin = await this.adminRepository.getById(id);

        if (!admin) {
            throw new NotFoundError("A admin nem található az adatbázisban", {
                data: { id },
            });
        }

        return admin;
    }

    
    async createAdmin(adminData) {
        
        if (!adminData) {
            throw new BadRequestError("Hiányzik az Admin adata a kérésből", {
                data: adminData,
            });
        }

        
        if (!adminData.felhasznalonev) {
            throw new BadRequestError("Hiányzik a Admin felhasznaloneve", { data: adminData });
        }

        if (!adminData.email) {
            throw new BadRequestError("Hiányzik az admin emailje", { data: cipoData });
        }
        if (!adminData.jelszo) {
            throw new BadRequestError("Hiányzik az admin jelszava", { data: cipoData });
        }

        

        

        return await this.adminRepository.create(adminData);
    }

    
    async updateAdmin(id, adatok) {
        if (!id) {
            throw new BadRequestError("Hiányzik az admin azonosító (ID) a módosításhoz", {
                data: { id },
            });
        }

        if (!adatok) {
            throw new BadRequestError("Hiányoznak a módosítandó adatok", {
                data: adatok,
            });
        }

        
        const admin = await this.adminRepository.getById(id);

        if (!admin) {
            throw new NotFoundError("A módosítandó admin nem található", {
                data: { id },
            });
        }

        // itt simán továbbadjuk az adatokat és a repository csinálja az update-et
        return await this.adminRepository.update(id, adatok);
    }

    
    async deleteAdmin(id) {
        if (!id) {
            throw new BadRequestError("Hiányzik az Admin azonosító (ID) a törléshez", {
                data: { id },
            });
        }

        const admin = await this.adminRepository.getById(id);

        if (!admin) {
            throw new NotFoundError("A törlendő admin nem található", {
                data: { id },
            });
        }

        return await this.adminRepository.delete(id);
    }
}

module.exports = adminService;
