const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { initDocker, isContainerRunning } = require("./../docker");

const URL_SERVICE_CRUD = 'http://localhost:3333';

const app = express();

app.use(express.json());
app.use(cors());

const routes = express.Router();

const autorizacaoMid = require("./middlewares/autorizacao");

routes.post("/iniciar-snnifer", autorizacaoMid, async (req, res) => {

    try {

        initDocker(req.id);

        return res.status(201).send({
            message: "Sessão iniciada com sucesso",
            status_code: 200,
        });

    } catch (error) {
        return res.status(404).send({
            message: "Falha ao iniciar a sessão o usuário",
            status_code: 404
        });
    }

});

routes.get("/validar-container", autorizacaoMid, async (req, res) => {

    const userId = req.id;

    try {

        const containerRunning = await isContainerRunning(req.id);

        const response = (await axios.get(`${URL_SERVICE_CRUD}/usuario/${userId}/validar-instancia`)).data;

        let status = '';
        const statusInstance = response.data.statusInstance ?? false;

        if (containerRunning == false && statusInstance == false) {
            // SESSÃO INATIVADA OU AGUARDANDO CONEXÃO
            if (response.data.imagem ?? '' != '') {
                status = 'AGUARDANDO CONEXÃO';
            } else {
                status = 'INATIVA';
            }

        } else if (containerRunning == false && statusInstance) {
            // CONTAINER NEGATIVO MAS, BANCO ESTÁ POSITIVO
            await axios.post(`${URL_SERVICE_CRUD}/usuario/${userId}/encerrar-instancia`);
            status = 'INATIVA';

        } else if (containerRunning && statusInstance == false) {
            // CONTAINER POSITIVO MAS, BANCO ESTÁ NEGATIVO
            if (response.data.imagem ?? '' != '') {
                status = 'AGUARDANDO CONEXÃO';
            } else {
                await axios.post(`${URL_SERVICE_CRUD}/usuario/${userId}/iniciar-instancia`);
                status = 'ATIVA';
            }
        } else {
            status = 'ATIVA';
        }

        return res.status(201).send({
            message: `Sessão do usuário está ${status}`,
            status_code: 200,
            data: {
                status,
                container_running: containerRunning,
                ...(response.data.imagem != '' && { imagem: response.data.imagem })
            }
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
