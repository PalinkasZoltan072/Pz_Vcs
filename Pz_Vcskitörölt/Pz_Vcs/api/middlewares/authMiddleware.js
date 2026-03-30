const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        // console.log("van token")
        return next(new UnauthorizedError("Token hiányzik"));
    
    } // ez a szabvany hogy "Bearer és token" a swagger így működik jól és minden forntendes library így várja (idézőjelek nélkül)
        

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // console.log("érvénytelen volt a token")
        return next(new UnauthorizedError("Érvénytelen token"));
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin")
        return next(new UnauthorizedError("Nincs admin jogosultság"));

    next();
};