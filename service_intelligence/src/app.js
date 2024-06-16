const express = require("express");
const cors = require("cors");

const app = express();

const intelligenceAnalyse = require("./intelligence");

app.use(express.json());
app.use(cors());

app.post("/analise-mensagem", async (req, res) => {

    const message = req.body;

    try {
        const response = await intelligenceAnalyse(message);

        return res.status(200).send({
            message: "Análise realizada com sucesso",
            status_code: 200,
            data: { ...response }
        });

    } catch (error) {
        console.log(error);
        return res.status(404).send({
            message: `Erro ao consumir API da OpenAI: ${error}`,
            status_code: 404
        });
    }

});

module.exports = app;
