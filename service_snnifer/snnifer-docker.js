const { Client } = require('whatsapp-web.js');

const axios = require('axios');

require("dotenv").config();
const URL_SERVICE_CRUD = process.env.URL_SERVICE_CRUD_DOCKER;
const URL_SERVICE_INTELLIGENCE = process.env.URL_SERVICE_INTELLIGENCE_DOCKER;

function initSnnifer() {

    var id = process.env.USER_ID;

    const client = new Client({
        qrMaxRetries: 20,
        authTimeout: 240000,
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
            ],
        }
    });

    client.on('qr', async (qr) => {
        try {
            if (qr != '') {
                await axios.post(`${URL_SERVICE_CRUD}/usuario/${id}/inserir-qrcode`, {
                    tokenQrcode: qr
                });
                console.log('Token QRCODE:', qr);
            }

        } catch (err) {
            console.log("[DEBUG] EVENT QR - Falha ao salvar o QRCODE");
        }
    });

    client.on('authenticated', () => {
        console.log('Autenticado com sucesso.');
    });

    client.on('auth_failure', msg => {
        console.error('Falha na autenticação:', msg);
    });

    client.on('error', (error) => {
        console.error('Erro no cliente:', error);
    });

    client.on('loading_screen', (percent, message) => {
        console.log(`[DEBUG] Carregando: ${percent}% - ${message}`);
    });

    client.on('change_state', state => {
        console.log(`[DEBUG] Estado alterado: ${state}`);
    });

    client.on('ready', async () => {
        console.log('[DEBUG] Cliente se CONECTOU ao \"Cliente Personalizado\".');
        try {
            await axios.post(`${URL_SERVICE_CRUD}/usuario/${id}/iniciar-instancia`);
        } catch (error) {
            console.log("[DEBUG] EVENT READY - Falha ao salvar início da sessão do usuário");
        }
    });

    client.on('disconnected', async () => {
        console.log('[DEBUG] Cliente se DESCONECTOU ao \"Cliente Personalizado\".');
        try {
            await axios.post(`${URL_SERVICE_CRUD}/usuario/${id}/encerrar-instancia`);
            process.exit(0);
        } catch (error) {
            console.log("[DEBUG] EVENT DISCONNECTED - Falha ao encerrar a sessão o usuário");
        }
    });

    async function snniferMensagens(msg) {

        const celular_usuario_destino = msg.to.split('@')[0];

        try {

            // Validação se o usuário existe no banco
            const resposta = await axios.get(`${URL_SERVICE_CRUD}/usuario/${celular_usuario_destino}`);

            const dados_analise = {
                "contatoMensagem": msg._data.body,
                "contatoNumero": msg._data.from,
            }

            // Envio de mensagem para análise de inteligência
            const resposta_inteligencia = await axios.post(`${URL_SERVICE_INTELLIGENCE}/analise-mensagem`, dados_analise);

            // Salvando dados do SCORE
            msg.fraudeScore = resposta_inteligencia.data.data.fraudeScore;
            msg.fraudePorcentagem = resposta_inteligencia.data.data.fraudePorcentagem;

            // Cadastro de mensagem no banco
            await axios.post(`${URL_SERVICE_CRUD}/usuario/${resposta.data.data.usuario._id}/mensagem`, { message: msg });

        } catch (error) {
            console.log("[DEBUG] EVENT MESSAGE - Falha ao analisar mensagem recebida: " + error);
        }

    }

    client.on('message', msg => snniferMensagens(msg));

    client.initialize();

}

initSnnifer();
console.log('SERVIÇO INICIANDO...');