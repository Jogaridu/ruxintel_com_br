
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

    // SNNIFER
    async cadastrarMensagem(req, res) {

        const { id } = req.params;

        const { message } = req.body;

        try {

            if (message._data.type != 'chat') {
                return res.status(204).send({ status_code: 204 });
            }

            const remetente = message.from.split('@');

            const mensagem = {
                "id": message.id.id,
                "body": message._data.body,
                "timestamp": message._data.t,
                "notifyName": message._data.notifyName,
                "type": message._data.type,
                "duration": message._data?.duration ?? null,
                "hasMedia": message.hasMedia,
                "deviceType": message.deviceType,
                "score": message.fraudeScore
            };

            let updateConfig = {
                $set: {
                    [`contacts.${remetente[0]}.phone`]: remetente[0],
                    [`contacts.${remetente[0]}.region`]: remetente[1]
                },
                $push: {
                    [`contacts.${remetente[0]}.messages`]: mensagem
                }
            };

            if (mensagem.score >= 6) {
                updateConfig.$push.messagesCritical = mensagem;
            }
            console.log(mensagem);

            const usuario = await Usuarios.findOneAndUpdate(
                { _id: id },
                updateConfig,
                { new: true, runValidators: true }
            );

            if (!usuario) {
                return res.status(404).send({
                    message: "Falha ao buscar o usuário",
                    status_code: 404
                });
            }

            return res.status(201).send({
                message: "Mensagem cadastrada com sucesso",
                status_code: 201
            });

        } catch (error) {
            console.log(error);
            return res.status(404).send({
                message: "Falha ao cadastrar mensagem",
                status_code: 404
            });
        }

    },

    async cadastrarQrcode(req, res) {

        const { id } = req.params;

        const { image } = req.body;

        try {

            const usuario = await Usuarios.findOneAndUpdate(
                { _id: id },
                updateConfig,
                { new: true, runValidators: true }
            );

            if (!usuario) {
                return res.status(404).send({
                    message: "Falha ao buscar o usuário",
                    status_code: 404
                });
            }

            return res.status(201).send({
                message: "Mensagem cadastrada com sucesso",
                status_code: 201
            });

        } catch (error) {
            console.log(error);
            return res.status(404).send({
                message: "Falha ao cadastrar mensagem",
                status_code: 404
            });
        }

    },

    // INSTANCIAS
    async validarInstancia(req, res) {

        const usuario = await Usuarios.findById(req.id);

        if (!usuario) {
            return res.status(404).send({
                message: "Usuário inválido",
                status_code: 404,
            });
        }

        if (!usuario.statusInstance) {
            return res.status(404).send({
                message: "Instância INATIVA",
                status_code: 404,
                data: { statusInstance: false }
            });
        }

        return res.status(404).send({
            message: "Instância ATIVA",
            status_code: 404,
            data: { statusInstance: true }
        });

    },

    async iniciarInstancia(req, res) {

        const { id } = req.params;

        try {

            await Usuarios.findOneAndUpdate(
                { _id: id },
                { statusInstance: true },
                { new: true, runValidators: true }
            );

            return res.status(200).send({
                message: "Instância inciada",
                status_code: 200
            });

        } catch (error) {
            console.log(error);
            return res.status(404).send({
                message: "Falha ao iniciar",
                status_code: 404
            });
        }

    }

}