const express = require("express");
const cors = require("cors");
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const routes = express.Router();

// routes.post("/qrcode/novo", controller.cadastrar);

module.exports = app;