const { Client } = require('whatsapp-web.js');

const axios = require('axios');

const URL_SERVICE_CRUD = 'http://192.168.0.21:3333';
const URL_SERVICE_INTELLIGENCE = 'http://192.168.0.21:4444';

function initSnnifer() {

    var id = process.env.USER_ID;

    const client = new Client({
        qrMaxRetries: 10,
        authTimeout: 240000
    });

    client.on('qr', async (qr) => {
        try {
            // links: [ { link: 'http://fancycoffee.fr', isSuspicious: false } ]
            // filehash: '1rl7nn6wQzQDR5qCK0RDL094P+m4zuQDmEFPsDOCDrI=',
            // encFilehash: '+w9Db2vgzOc05C1k8IKFIOD9J5jT3lpFHYmfvrNEGKM=',
            // size: 139213,
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

            if (resposta_inteligencia.data.status_code != 200) {
                //TODO: Avaliar lógica para disparar aviso caso a inteligência não funcione
            }

            // Salvando dados do SCORE
            msg.fraudeScore = resposta_inteligencia.data.data.fraudeScore;
            msg.fraudePorcentagem = resposta_inteligencia.data.data.fraudePorcentagem;

            // Cadastro de mensagem no banco
            await axios.post(`${URL_SERVICE_CRUD}/usuario/${resposta.data.data.usuario._id}/mensagem`, { message: msg });

        } catch (error) {
            console.log("[DEBUG] EVENT MESSAGE - Falha ao analisar mensagem recebida");
        }

    }

    // Só pega as mensagens recebidas
    client.on('message', msg => snniferMensagens(msg));

    client.initialize();

}

initSnnifer();
console.log('SERVIÇO INICIANDO...');