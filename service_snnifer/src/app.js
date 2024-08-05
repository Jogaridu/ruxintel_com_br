const express = require("express");
const cors = require("cors");
const initSnnifer = require("./snnifer");

const app = express();

app.use(express.json());
app.use(cors());

const routes = express.Router();

const autorizacaoMid = require("./middlewares/autorizacao");

routes.post("/iniciar-snnifer", autorizacaoMid, async (req, res) => {

    try {

        await initSnnifer(req.id);

        return res.status(201).send({
            message: "Sessão iniciada com sucesso",
            status_code: 200,
        });

    } catch (error) {
        console.log(error);
        return res.status(404).send({
            message: "Falha ao iniciar a sessão o usuário",
            status_code: 404
        });
    }

});

app.use(routes);
const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
