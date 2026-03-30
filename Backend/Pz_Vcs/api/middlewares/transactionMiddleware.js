const db = require("../db");

exports.attachTransaction = async (req, res, next) => {
    if(process.env.NODE_ENV === "test" || req.get("referer")?.includes("/api/docs")) {
        const t = await db.sequelize.transaction();

        const cleanUpTransaction = async () => {
            if (!req.transaction) return; // Ha már lefutott, ne fusson le kétszer
            
            try {
                // Ha a válaszkód sikeres, jóváhagyjuk a módosítást az adatbázisban
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    await req.transaction.commit();
                } else {
                    await req.transaction.rollback();
                }
            } catch(_) {}

            req.transaction = undefined;
        }

        res.on("finish", cleanUpTransaction);
        res.on("close", cleanUpTransaction);

        req.transaction = t;
    }

    next();
}