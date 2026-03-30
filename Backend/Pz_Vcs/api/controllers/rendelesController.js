const db = require("../db");
const { rendelesService } = require("../service")(db);
const { UnauthorizedError } = require("../errors");

exports.getRendelesek = async (req, res, next) => {
    try {
        const filter = req.rendelesFilter || {};

        res.status(200).json(
            await rendelesService.getRendelesek(filter, {
                transaction: req.transaction,
            })
        );
    } catch (error) {
        next(error);
    }
};

exports.getRendeles = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const rendeles = await rendelesService.getRendeles(id, {
            transaction: req.transaction,
        });

        if (
            req.user.role !== "admin" &&
            rendeles.Felhasznalo_id !== req.user.id
        ) {
            throw new UnauthorizedError("Nincs jogosultság ehhez a rendeléshez");
        }

        res.status(200).json(rendeles);
    } catch (error) {
        next(error);
    }
};
exports.createRendeles = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // 1. Kiszedjük a 'meret'-et is a req.body-ból!
        const { cipoId, mennyiseg, fizetes, meret } = req.body;

        const result = await rendelesService.createRendeles(
            {
                Felhasznalo_id: userId,
                Cipo_id: cipoId,
                mennyiseg,
                fizetes,
                meret, // 2. Átadjuk az adatbázisnak!
                allapot: "szállítás alatt",
            },
            {
                transaction: req.transaction,
            }
        );

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};
// exports.createRendeles = async (req, res, next) => {
//     try {
//         const userId = req.user.id;
//         const { cipoId, mennyiseg, fizetes } = req.body;

//         const result = await rendelesService.createRendeles(
//             {
//                 Felhasznalo_id: userId,
//                 Cipo_id: cipoId,
//                 mennyiseg,
//                 fizetes,
//                 allapot: "szállítás alatt",
//             },
//             {
//                 transaction: req.transaction,
//             }
//         );

//         res.status(201).json(result);
//     } catch (error) {
//         next(error);
//     }
// };

exports.updateRendeles = async (req, res, next) => {
    try {
        await rendelesService.updateRendeles(
            Number(req.params.id),
            req.body,
            {
                transaction: req.transaction,
            }
        );

        res.status(200).json({ message: "Rendelés frissítve" });
    } catch (error) {
        next(error);
    }
};

exports.deleteRendeles = async (req, res, next) => {
    try {
        await rendelesService.deleteRendeles(
            Number(req.params.id),
            {
                transaction: req.transaction,
            }
        );

        res.status(200).json({ message: "Rendelés törölve" });
    } catch (error) {
        next(error);
    }
};
// ======================
// KOSÁR
// ======================

exports.getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const cart = await rendelesService.getCart(userId, {
            transaction: req.transaction
        });

        res.status(200).json(cart);

    } catch (error) {
        next(error);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { cipoId } = req.body;

        const result = await rendelesService.addToCart(
            userId,
            cipoId,
            { transaction: req.transaction }
        );

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};