const express = require("express");

const routes = express.Router();

const autorizacaoMid = require("../../middlewares/autorizacao");

const controller = require("../../controllers/usuario");

routes.get("/mensagens-criticas", autorizacaoMid, controller.buscarMensagensCriticas);
routes.post("/ignorar-mensagem", autorizacaoMid, controller.ignorarMensagem);

module.exports = routes;