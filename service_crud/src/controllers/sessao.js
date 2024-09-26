const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../config/auth");
const Usuarios = require("../model/usuario");

module.exports = {
    async logar(req, res) {

        try {

            const { username, password } = req.body;

            const usuario = await Usuarios.findOne({ username });

            if (!usuario) {
                return res.status(404).send({ erro: "Usuário ou senha incorreto." });
            }

            if (!bcrypt.compareSync(password, usuario.password)) {
                return res.status(404).send({ erro: "Usuário ou senha incorreto." });
            }

            const token = jwt.sign({ _id: usuario._id }, auth.secret);
            return res.status(200).send({ id: usuario.id, login: usuario.login, token });

        } catch (error) {
            console.log(error);
            console.log({ erro: "Falha no login" });
        }
    },
};
