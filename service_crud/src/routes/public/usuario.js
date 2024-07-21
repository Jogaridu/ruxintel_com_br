const express = require("express");

const routes = express.Router();

const controller = require("../../controllers/usuario");

routes.post("/usuario", controller.cadastrar);

routes.get("/usuario/:celular", controller.buscarPorCelular);

// SERVIÇO DE SNNIFER UTILIZA
routes.post("/usuario/:id/mensagem", controller.cadastrarMensagem);

module.exports = routes;
