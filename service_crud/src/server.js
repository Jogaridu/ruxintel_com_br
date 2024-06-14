const app = require("./app");
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);

    mongoose.connect('mongodb://localhost:27017/ruxintel_com_br', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('MongoDB conectado');
    });

});
