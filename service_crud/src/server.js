const app = require("./app");
const mongoose = require('mongoose');
require("dotenv").config()

const PORT = process.env.PORT || 3333;
const USER = process.env.USER_DB;
const PASSWD = process.env.PASSWORD_DB;
const CLUSTER = process.env.CLUSTER_DB;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
    uri = `mongodb+srv://${USER}:${PASSWD}@${CLUSTER}/ruxintel_com_br?authMechanism=DEFAULT`;

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('MongoDB conectado');
    });

});
