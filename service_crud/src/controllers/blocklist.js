
const convertTimestampToBRDateTime = require("../utils/converterTimestamp");
const BlockList = require("../model/blocklist");

module.exports = {

    async listar(req, res) {

        try {

            const dados = await BlockList.find({ countReports: { $gt: 2 } }).select('_id phone countReports');

            return res.status(200).send({
                message: "Registros retornado com sucesso",
                status_code: 200,
                data: { dados }
            });

        } catch (error) {
            return res.status(404).send({
                message: "Falha ao buscar o usuário",
                status_code: 404
            });
        }

    },

    async buscarPorUuid(req, res) {

        const { uuid } = req.params;

        try {

            const dados = await BlockList.findById(uuid).select('_id phone countReports');

            if (!dados) {
                return res.status(404).send({
                    message: "Registro não encontrado",
                    status_code: 404,
                });
            }

            return res.status(200).send({
                message: "Registros retornados com sucesso",
                status_code: 200,
                data: { dados }
            });

        } catch (error) {
            return res.status(404).send({
                message: "Falha ao buscar o usuário",
                status_code: 404
            });
        }

    },

}