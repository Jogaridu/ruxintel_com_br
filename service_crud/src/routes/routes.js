const express = require("express");

const router = express.Router();

// Rotas publicas
const rotasPublicaSessao = require("./public/session");
const rotasUsuarios = require("./public/usuario");

// Rotas privadas
const rotasUsuariosAuth = require("./private/usuario_auth");

router.use(rotasPublicaSessao);
router.use(rotasUsuarios);
router.use(rotasUsuariosAuth);

module.exports = router;
