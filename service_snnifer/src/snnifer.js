const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const openai = require('openai');

const client = new Client({
    webVersionCache: {
        type: "remote",
        remotePath:
            "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {
        small: true
    });
});

client.on('ready', () => {
    console.log('[DEBUG] Cliente se conectou ao \"Cliente Personalizado\".');
});

async function snniferMensagens(msg) {

    const celular_usuario_destino = msg.to.split('@')[0];

    try {

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

        const resposta_inteligencia = await axios.post(`http://localhost:4444/analise-mensagem`, dados_analise);

        if (resposta_inteligencia.status_code != 200) {
            return false;
        }

        msg.fraudeScore = resposta_inteligencia.data.data.fraudeScore;
        msg.fraudePorcentagem = resposta_inteligencia.data.data.fraudePorcentagem;

        const resposta_mensagem = await axios.post(`http://localhost:3333/usuario/${resposta.data.data.usuario._id}/mensagem`, { message: msg });

    } catch (error) {
        console.log(error);
    }

}

// Só pega as mensagens recebidas
client.on('message', msg => snniferMensagens(msg));

client.initialize();