const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).send({ error: "Token não informado" });
    }

    const [Bearer, token] = authorization.split(" ");

    if (!token) {
        res.status(401).send({ error: "Token mal formatado" });
    }

    try {

        const retorno = jwt.verify(token, authConfig.secret);
        req.id = retorno._id;
        return next();

    } catch (error) {
        res.status(401).send({ error: "Token Inválido" });
    }
};
