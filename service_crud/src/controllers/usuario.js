
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../config/auth.json");
const Usuarios = require("../model/usuario");

module.exports = {

    async cadastrar(req, res) {

        const { password, ...rest } = req.body;

        try {

            const hashedPassword = await bcrypt.hash(password, 10);
            const usuario = new Usuarios({ ...rest, password: hashedPassword });
            await usuario.save();

            const token = jwt.sign(
                { id: usuario.id },
                auth.secret
            );

            return res.status(201).send({
                message: "Usuário cadastrado com sucesso",
                status_code: 200,
                data: { usuario, token }
            });

        } catch (error) {
            console.log(error);
            return res.status(404).send({
                message: "Falha ao cadastrar o usuário",
                status_code: 404
            });
        }
    },

    async buscarPorCelular(req, res) {

        const { celular } = req.params;

        try {

            const usuario = await Usuarios.findOne({ phone: celular }).select('_id username');

            if (!usuario) {
                return res.status(404).send({
                    message: "Usuário inválido",
                    status_code: 404,
                });
            }

            return res.status(200).send({
                message: "Usuário retornado com sucesso",
                status_code: 200,
                data: { usuario }
            });

        } catch (error) {
            console.log(error);
            return res.status(404).send({
                message: "Falha ao buscar o usuário",
                status_code: 404
            });

        };

    },

    async cadastrarMensagem(req, res) {

        const { id } = req.params;

        const { message } = req.body;


        Usuarios.findByIdAndUpdate(id,)

    }

}