const express = require("express");

const router = express.Router();

// Rotas publicas
const rotasPublicaSessao = require("./public/session");
const rotasUsuarios = require("./public/usuario");

// Rotas privadas

router.use(rotasPublicaSessao);
router.use(rotasUsuarios);

module.exports = router;
