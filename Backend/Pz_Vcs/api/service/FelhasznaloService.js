const { BadRequestError, NotFoundError } = require("../errors");
const bcrypt = require("bcrypt");
const emailService = require("./EmailService");
const jwt = require("jsonwebtoken");

const salt = 14;

class FelhasznaloService {
    constructor(db) {
        this.felhasznaloRepository = require("../repositories")(db).felhasznaloRepository;
    }

    // LOGIN → nem kell transaction
    async login(email, jelszo) {
        if (!email || !jelszo)
            throw new BadRequestError("Email és jelszó kötelező");

        const user = await this.felhasznaloRepository.getByEmail(email);

        if (!user)
            throw new NotFoundError("Felhasználó nem található");

        const isMatch = bcrypt.compareSync(jelszo, user.jelszo);
        if (!isMatch)
            throw new BadRequestError("Hibás jelszó");

        const token = jwt.sign(
            {
                id: user.id,
                role: "user"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        return { token };
    }

    async getFelhasznalok(filter = {}, options = {}) {
        return await this.felhasznaloRepository.getAll(filter, options);
    }

    async getFelhasznalo(id, options = {}) {
        if (!id)
            throw new BadRequestError("Hiányzik az ID a kérésből", { data: { id } });

        const user = await this.felhasznaloRepository.getById(id, options);

        if (!user)
            throw new NotFoundError("A felhasználó nem található az adatbázisban", {
                data: { id },
            });

        return user;
    }

    async createFelhasznalo(userData, options = {}) {
        if (!userData)
            throw new BadRequestError("Hiányzik a felhasználó adat", { data: userData });

        if (!userData.email)
            throw new BadRequestError("Hiányzik az email cím", { data: userData });

        if (!userData.jelszo)
            throw new BadRequestError("Hiányzik a jelszó", { data: userData });

        if (!userData.felhasznalonev)
            throw new BadRequestError("Hiányzik a felhasználónév", { data: userData });

        const existingUser = await this.felhasznaloRepository.getByEmail(userData.email, options);
        if (existingUser)
            throw new BadRequestError("Ez az email már regisztrálva van");

        const existingUsername = await this.felhasznaloRepository.getByUsername(userData.felhasznalonev, options);
        if (existingUsername)
            throw new BadRequestError("Ez a felhasználónév már foglalt");

        userData.jelszo = bcrypt.hashSync(userData.jelszo, salt);

        const newUser = await this.felhasznaloRepository.create(userData, options);

        if (process.env.NODE_ENV !== "test") {
            try {
                await emailService.sendWelcomeEmail(newUser.email);
            } catch (err) {
                console.log("Email küldési hiba:", err.message);
            }
        }

        return newUser;
    }

    async updateFelhasznalo(id, adatok, options = {}) {
        if (!id)
            throw new BadRequestError("Hiányzik az ID a módosításhoz", { data: { id } });

        const user = await this.felhasznaloRepository.getById(id, options);
        if (!user)
            throw new NotFoundError("A felhasználó nem létezik", { data: { id } });

        if (adatok.jelszo)
            adatok.jelszo = bcrypt.hashSync(adatok.jelszo, salt);

        return await this.felhasznaloRepository.update(id, adatok, options);
    }

    async deleteFelhasznalo(id, options = {}) {
        if (!id)
            throw new BadRequestError("Hiányzik az ID a törléshez", { data: { id } });

        const user = await this.felhasznaloRepository.getById(id, options);
        if (!user)
            throw new NotFoundError("A felhasználó nem található", { data: { id } });

        return await this.felhasznaloRepository.delete(id, options);
    }
}

module.exports = FelhasznaloService;