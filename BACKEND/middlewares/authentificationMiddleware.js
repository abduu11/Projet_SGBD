const jwt = require('jsonwebtoken');
require('dotenv').config();

const authentificationMiddleware = (req, res, next) => {

    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Acces refuser. Vous devez etre muni d\'un token" });
    }

    try {

        req.user = jwt.verify(token.split(" ")[1], process.env.SECRET);

        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalide ou expire." });
    }
};

module.exports = authentificationMiddleware;