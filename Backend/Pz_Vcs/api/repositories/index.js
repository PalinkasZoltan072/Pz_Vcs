const CipoRepository = require("./CipoRepository");
const FelhasznaloRepository = require("./FelhasznaloRepository")
const RendelesRepository = require("./RendelesRepository")
const AdminRepository = require ("./AdminRepository")


module.exports = (db) =>
{
     const cipoRepository = new CipoRepository(db);
     const felhasznaloRepository = new FelhasznaloRepository(db);
     const rendelesRepository = new RendelesRepository(db);
     const adminRepository = new AdminRepository(db)
     //const bankkartyaRepository = new BankkartyaRepository(db);

    return { felhasznaloRepository, cipoRepository, rendelesRepository, adminRepository}// bankkartyaRepository };
}