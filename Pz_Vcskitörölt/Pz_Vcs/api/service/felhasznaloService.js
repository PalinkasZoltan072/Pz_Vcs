// const { BadRequestError, NotFoundError } = require("../errors");
// // ezt kell majd hasznalni de alaposan at kell irni hogy jó legyen a kódunkra és megérteni
// const bcrypt = require("bcrypt");

// const salt = 14;

// class UserService
// {
//     constructor(db)
//     {
//         this.userRepository = require("../repositories")(db).userRepository;
//     }

//     async getUsers()
//     {
//         return await this.userRepository.getUsers();
//     }

//     async getUser(userID)
//     {
//         if(!userID) throw new BadRequestError("Missing user identification from payload");

//         const user = await this.userRepository.getUser(userID);

//         if(!user) throw new NotFoundError("User does not exist in our database", { data: { userID } });
        
//         return user;
//     }

//     async createUser(userData)
//     {
//         if(!userData) throw new BadRequestError("Missing user data when creating user object", 
//         {
//             data: userData,
//         });

//         if(!userData.name) throw new BadRequestError("Missing username from payload", 
//         {
//             data: userData,
//         });

//         if(!userData.password) throw new BadRequestError("Missing password from payload", 
//         {
//             data: userData,
//         });

//         userData.password = bcrypt.hashSync(userData.password, salt);

//         return await this.userRepository.createUser(userData);
//     }
// }

// module.exports = UserService;
const { BadRequestError, NotFoundError } = require("../errors");
const bcrypt = require("bcrypt");

const salt = 14;

class FelhasznaloService {
    constructor(db) {
        
        this.felhasznaloRepository = require("../repositories")(db).felhasznaloRepository;
    }


    async getFelhasznalok(filter={}) {
        return await this.felhasznaloRepository.getAll(filter); // összest lekéri
    }

    
    async getFelhasznalo(id) { // adottat kér le id alapján
        if (!id)
            throw new BadRequestError("Hiányzik az ID a kérésből", { data: { id } });

        const user = await this.felhasznaloRepository.getById(id);

        if (!user)
            throw new NotFoundError("A felhasználó nem található az adatbázisban", {
                data: { id },
            });

        return user;
    }

    
    async createFelhasznalo(userData) {
        
        if (!userData)
            throw new BadRequestError("Hiányzik a felhasználó adat", { data: userData });

        if (!userData.email)
            throw new BadRequestError("Hiányzik az email cím", { data: userData });

        if (!userData.jelszo)
            throw new BadRequestError("Hiányzik a jelszó", { data: userData });

        if (!userData.felhasznalonev)
            throw new BadRequestError("Hiányzik a felhasználónév", { data: userData });

        
        userData.jelszo = bcrypt.hashSync(userData.jelszo, salt);

        return await this.felhasznaloRepository.create(userData);
    }

    
    async updateFelhasznalo(id, adatok) {
        if (!id)
            throw new BadRequestError("Hiányzik az ID a módosításhoz", { data: { id } });

        
        const user = await this.felhasznaloRepository.getById(id);
        if (!user)
            throw new NotFoundError("A felhasználó nem létezik", { data: { id } });

        
        if (adatok.jelszo)
            adatok.jelszo = bcrypt.hashSync(adatok.jelszo, salt); // ezt nem értem teljesen hogy működik a salt

        return await this.felhasznaloRepository.update(id, adatok);
    }

    
    async deleteFelhasznalo(id) {
        if (!id)
            throw new BadRequestError("Hiányzik az ID a törléshez", { data: { id } });

        const user = await this.felhasznaloRepository.getById(id);
        if (!user)
            throw new NotFoundError("A felhasználó nem található", { data: { id } });

        return await this.felhasznaloRepository.delete(id);
    }
}

module.exports = FelhasznaloService;
