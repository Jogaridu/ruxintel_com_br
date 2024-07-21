const express = require("express");

const routes = express.Router();

const autorizacaoMid = require("../../middlewares/autorizacao");

const controller = require("../../controllers/usuario");

routes.get("/validar-instancia", autorizacaoMid, controller.validarInstancia);

module.exports = routes;