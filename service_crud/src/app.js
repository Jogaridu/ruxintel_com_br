const express = require("express");
const cors = require("cors");
const router = require("./routes/routes");

const app = express();

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(router);

module.exports = app;
