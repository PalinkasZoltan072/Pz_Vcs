const FelhasznaloService = require("./felhasznaloService");
const CipoService = require("./cipoService");
const RendelesService = require("./rendelesService");
const AdminService = require("./adminService")
//const BankkartyaService = require("./bankkartyaService");

module.exports = (db) =>
{
    const felhasznaloService = new FelhasznaloService(db);
    const cipoService = new CipoService(db);
    const rendelesService = new RendelesService(db);
    const adminService = new AdminService(db)
    // const bankkartyaService = new BankkartyaService(db);

    return {felhasznaloService, cipoService,rendelesService, adminService}//bankkartyaService};
}