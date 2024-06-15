const express = require("express");

const routes = express.Router();

// const autorizacaoMid = require("../../middlewares/autorizacao");

const controller = require("../../controllers/usuario");

routes.post("/usuario", controller.cadastrar);

routes.get("/usuario/:celular", controller.buscarPorCelular);

routes.post("/usuario/:id/mensagem", controller.cadastrarMensagem);

// routes.get("/filiais", controller.listar);

// routes.delete("/filial/:id", autorizacaoMid, controller.deletar);

// routes.put("/filial/:id", autorizacaoMid, controller.atualizar);

module.exports = routes;
