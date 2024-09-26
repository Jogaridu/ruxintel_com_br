const express = require("express");

const routes = express.Router();

const controller = require("../../controllers/blocklist");

routes.get("/blocklist", controller.listar);
routes.get("/blocklist/:uuid", controller.buscarPorUuid);
routes.get("/blocklist/:phone/phone", controller.buscarPorTelefone);

module.exports = routes;
