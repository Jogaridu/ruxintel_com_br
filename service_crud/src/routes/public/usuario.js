const express = require("express");

const routes = express.Router();

const controller = require("../../controllers/usuario");

routes.post("/usuario", controller.cadastrar);

routes.get("/usuario/:celular", controller.buscarPorCelular);

// SERVIÇO DE SNNIFER UTILIZA
routes.post("/usuario/:id/mensagem", controller.cadastrarMensagem);
routes.post("/usuario/:id/iniciar-instancia", controller.iniciarInstancia);
routes.post("/usuario/:id/encerrar-instancia", controller.encerrarInstancia);
routes.post("/usuario/:id/inserir-qrcode", controller.inserirQrcode);
routes.get("/usuario/:id/validar-instancia", controller.validarInstancia);

module.exports = routes;
