const express = require("express");

const routes = express.Router();

// const autorizacaoMid = require("../../middlewares/autorizacao");

const controller = require("../../controllers/usuario");

routes.post("/usuario", controller.cadastrar);

// routes.get("/filial/:id", controller.buscarPorId);

// routes.get("/filiais", controller.listar);

// routes.delete("/filial/:id", autorizacaoMid, controller.deletar);

// routes.put("/filial/:id", autorizacaoMid, controller.atualizar);


module.exports = routes;
