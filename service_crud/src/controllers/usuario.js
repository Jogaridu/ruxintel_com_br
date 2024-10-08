
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../config/auth");
const Usuarios = require("../model/usuario");
const QRCode = require('qrcode');
const convertTimestampToBRDateTime = require("../utils/converterTimestamp");
const BlockList = require("../model/blocklist");

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
            return res.status(404).send({
                message: "Falha ao buscar o usuário",
                status_code: 404
            });
        }

    },

    async buscarMensagensCriticas(req, res) {

        try {

            const usuario = await Usuarios.findById(req.id).select('_id messagesCritical');

            if (!usuario) {
                return res.status(404).send({
                    message: "Usuário não encontrado",
                    status_code: 404,
                });
            }

            const mensagens = [];

            usuario.messagesCritical.forEach(item => {
                if (!item.ignored) {
                    mensagens.push({
                        body: item.body,
                        notifyName: item.notifyName,
                        score: item.score,
                        timestamp: convertTimestampToBRDateTime(item.timestamp)
                    });
                }
            });

            return res.status(200).send({
                message: "Mensagens retornadas com sucesso",
                status_code: 200,
                data: { mensagens, numero_mensagens: mensagens.length }
            });

        } catch (error) {
            console.log(error);
            return res.status(404).send({
                message: "Falha ao buscar mensagens",
                status_code: 404
            });
        }

    },

    async ignorarMensagem(req, res) {

        try {

            const usuario = await Usuarios.findById(req.id).select('_id messagesCritical');

            if (!usuario) {
                return res.status(404).send({
                    message: "Usuário não encontrado",
                    status_code: 404,
                });
            }

            const { msg_id } = req.body;

            usuario.messagesCritical = usuario.messagesCritical.map(item => {
                if (item.id == msg_id) {
                    item.ignored = true;
                }
                return item;
            });

            await Usuarios.findOneAndUpdate(
                { _id: req.id },
                { messagesCritical: usuario.messagesCritical },
                { new: true, runValidators: true }
            );

            return res.status(200).send({
                message: "Mensagens retornadas com sucesso",
                status_code: 200,
            });

        } catch (error) {
            console.log(error);
            return res.status(404).send({
                message: "Falha ao buscar mensagens",
                status_code: 404
            });
        }

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
                "score": message.fraudeScore,
                "phone_number": remetente[0]
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

                const result = await BlockList.findOneAndUpdate(
                    { phone: remetente[0] },
                    { $inc: { countReports: 1 } },
                    { new: true, upsert: true }
                );

            }

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

    async inserirQrcode(req, res) {

        const { id } = req.params;
        const { tokenQrcode } = req.body;

        try {

            await Usuarios.findOneAndUpdate(
                { _id: id },
                { tokenQrcode, statusInstance: false },
                { new: true, runValidators: true }
            );

            return res.status(200).send({
                message: "Atualizado com sucesso",
                status_code: 200
            });

        } catch (error) {
            return res.status(404).send({
                message: "Falha ao atualizar",
                status_code: 404
            });
        }
    },

    // INSTANCIAS
    async validarInstancia(req, res) {

        const { id } = req.params;
        const usuario = await Usuarios.findById(id);

        if (!usuario) {
            return res.status(404).send({
                message: "Usuário inválido",
                status_code: 404,
            });
        }

        // minutos
        const tempoExpirarTokenQrcode = 5;

        if (!usuario.statusInstance) {

            if ((usuario.tokenQrcode ?? "" != '') &&
                (new Date() - new Date(usuario.updatedAt)) / (1000 * 60) < tempoExpirarTokenQrcode) {

                const base64 = await QRCode.toDataURL(usuario.tokenQrcode, {
                    color: { dark: '#000000', light: '#ffffff' }
                });

                return res.status(200).send({
                    message: "Instância PENDENTE de conexão",
                    status_code: 200,
                    data: { statusInstance: false, imagem: base64 }
                });

            } else {
                return res.status(200).send({
                    message: "Instância INATIVA",
                    status_code: 200,
                    data: { statusInstance: false }
                });
            }
        }

        return res.status(200).send({
            message: "Instância ATIVA",
            status_code: 200,
            data: { statusInstance: true, qrcode: usuario.tokenQrcode }
        });

    },

    async iniciarInstancia(req, res) {

        const { id } = req.params;

        try {

            await Usuarios.findOneAndUpdate(
                { _id: id },
                { statusInstance: true, tokenQrcode: '' },
                { new: true, runValidators: true }
            );

            return res.status(200).send({
                message: "Instância iniciada",
                status_code: 200
            });

        } catch (error) {
            return res.status(404).send({
                message: "Falha ao iniciar",
                status_code: 404
            });
        }

    },

    async encerrarInstancia(req, res) {

        const { id } = req.params;

        try {

            await Usuarios.findOneAndUpdate(
                { _id: id },
                { statusInstance: false, tokenQrcode: '' },
                { new: true, runValidators: true }
            );

            return res.status(200).send({
                message: "Instância encerrada",
                status_code: 200
            });

        } catch (error) {
            return res.status(404).send({
                message: "Falha ao iniciar",
                status_code: 404
            });
        }

    }

}