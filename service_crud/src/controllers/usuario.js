
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../config/auth.json");
const Usuarios = require("../model/usuario");

module.exports = {

    async cadastrar(req, res) {

        const { password, ...rest } = req.body;

        try {

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new Usuarios({ ...rest, password: hashedPassword });
            await user.save();

            const token = jwt.sign(
                { id: user.id },
                auth.secret
            );

            return res.status(201).send({ user, token });

        } catch (error) {
            console.log(error);
            return res.status(404).send({ erro: "Falha ao cadastrar o usuário" });
        }
    },

}