const express = require("express");

const routes = express.Router();

const autorizacaoMid = require("../../middlewares/autorizacao");

const controller = require("../../controllers/usuario");

routes.get("/mensagens-criticas", autorizacaoMid, controller.buscarMensagensCriticas);

module.exports = routes;