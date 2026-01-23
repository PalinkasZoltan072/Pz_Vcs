const CipoRepository = require("./cipoRepository");
const FelhasznaloRepository = require("./felhasznaloRepository")
const RendelesRepository = require("./rendelesRepository")
const AdminRepository = require ("./adminRepository")
const BankkartyaRepository = require("./bankkartyaRepository")

module.exports = (db) =>
{
     const cipoRepository = new CipoRepository(db);
     const felhasznaloRepository = new FelhasznaloRepository(db);
     const rendelesRepository = new RendelesRepository(db);
     const adminRepository = new AdminRepository(db)
     //const bankkartyaRepository = new BankkartyaRepository(db);

    return { felhasznaloRepository, cipoRepository, rendelesRepository, adminRepository}// bankkartyaRepository };
}