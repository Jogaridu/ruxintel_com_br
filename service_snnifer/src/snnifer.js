const { Client } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const axios = require('axios');

function initSnnifer() {

    const client = new Client({
        webVersionCache: {
            type: "remote",
            remotePath:
                "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
        },
    });

    client.on('qr', async (qr) => {

        try {
            console.log(qr);
            const base64 = await QRCode.toDataURL(qr, {
                color: { dark: '#000000', light: '#ffffff' }
            });
            console.log('QR code em Base64:', base64);

        } catch (err) {
            console.error('Erro ao gerar o QR code:', err);
        }

    });

    client.on('ready', (config) => {
        console.log('[DEBUG] Cliente se conectou ao \"Cliente Personalizado\".');
        console.log(config);

    });

    async function snniferMensagens(msg) {

        const celular_usuario_destino = msg.to.split('@')[0];

        try {

            // Validação se o usuário existe no banco
            const resposta = await axios.get(`http://localhost:3333/usuario/${celular_usuario_destino}`);

            // TODO: Validar se o subprocesso deve ser encerrado
            if (resposta.data.status_code != 200) {
                return false;
                // return res.status(404).send({
                //     message: "Usuário inválido",
                //     status_code: 404,
                // });
            }

            const dados_analise = {
                "contatoMensagem": msg._data.body,
                "contatoNumero": msg._data.from,
            }

            // Envio de mensagem para análise de inteligência
            const resposta_inteligencia = await axios.post(`http://localhost:4444/analise-mensagem`, dados_analise);
            console.log(resposta_inteligencia);
            if (resposta_inteligencia.data.status_code != 200) {
                return false;
            }

            // Salvando dados do SCORE
            msg.fraudeScore = resposta_inteligencia.data.data.fraudeScore;
            msg.fraudePorcentagem = resposta_inteligencia.data.data.fraudePorcentagem;

            // Cadastro de mensagem no banco
            await axios.post(`http://localhost:3333/usuario/${resposta.data.data.usuario._id}/mensagem`, { message: msg });

        } catch (error) {
            console.log(error);
        }

    }

    // Só pega as mensagens recebidas
    client.on('message', msg => snniferMensagens(msg));

    client.initialize();

}

module.exports = initSnnifer;