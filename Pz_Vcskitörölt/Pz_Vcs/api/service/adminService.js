const { BadRequestError, NotFoundError } = require("../errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salt = 14;

class AdminService {
    constructor(db) {
        this.adminRepository = require("../repositories")(db).adminRepository;
    }

    // LOGIN → nem kell transaction
    async login(email, jelszo) {
        if (!email || !jelszo)
            throw new BadRequestError("Email és jelszó kötelező");

        const admin = await this.adminRepository.getByEmail(email);

        if (!admin)
            throw new NotFoundError("Admin nem található");

        const isMatch = bcrypt.compareSync(jelszo, admin.jelszo);

        if (!isMatch)
            throw new BadRequestError("Hibás jelszó");

        const token = jwt.sign(
            { id: admin.id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return { token };
    }

    async getAdminok(options = {}) {
        return await this.adminRepository.getAll(options);
    }

    async getAdmin(id, options = {}) {
        if (!id) {
            throw new BadRequestError("Hiányzik az Admin azonosító (ID) a kérésből", {
                data: { id },
            });
        }

        const admin = await this.adminRepository.getById(id, options);

        if (!admin) {
            throw new NotFoundError("Az admin nem található az adatbázisban", {
                data: { id },
            });
        }

        return admin;
    }

    async createAdmin(adminData, options = {}) {
        if (!adminData) {
            throw new BadRequestError("Hiányzik az Admin adata a kérésből", {
                data: adminData,
            });
        }

        if (!adminData.felhasznalonev) {
            throw new BadRequestError("Hiányzik az Admin felhasználóneve", {
                data: adminData,
            });
        }

        if (!adminData.email) {
            throw new BadRequestError("Hiányzik az admin emailje", {
                data: adminData,
            });
        }

        if (!adminData.jelszo) {
            throw new BadRequestError("Hiányzik az admin jelszava", {
                data: adminData,
            });
        }

        adminData.jelszo = bcrypt.hashSync(adminData.jelszo, salt);

        return await this.adminRepository.create(adminData, options);
    }

    async updateAdmin(id, adatok, options = {}) {
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

        const admin = await this.adminRepository.getById(id, options);

        if (!admin) {
            throw new NotFoundError("A módosítandó admin nem található", {
                data: { id },
            });
        }

        if (adatok.jelszo)
            adatok.jelszo = bcrypt.hashSync(adatok.jelszo, salt);

        return await this.adminRepository.update(id, adatok, options);
    }

    async deleteAdmin(id, options = {}) {
        if (!id) {
            throw new BadRequestError("Hiányzik az Admin azonosító (ID) a törléshez", {
                data: { id },
            });
        }

        const admin = await this.adminRepository.getById(id, options);

        if (!admin) {
            throw new NotFoundError("A törlendő admin nem található", {
                data: { id },
            });
        }

        return await this.adminRepository.delete(id, options);
    }
}

module.exports = AdminService;