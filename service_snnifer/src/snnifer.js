const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

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
    console.log('Client is ready!');
});

async function snniferMensagens(msg) {
    console.log(msg);
    const celular_usuario_destino = msg.to.split('@')[0];

    try {

        const resposta = await axios.get(`http://localhost:3333/usuario/${celular_usuario_destino}`);

        if (resposta.data.status_code != 200) {
            // return res.status(404).send({
            //     message: "Usuário inválido",
            //     status_code: 404,
            // });
        }

        const resposta_mensagem = await axios.post(`http://localhost:3333/usuario/${resposta.data.data.usuario._id}/mensagem`, { message: msg });

    } catch (error) {
        console.log(error);
    }
}

// Só pega as mensagens recebidas
client.on('message', msg => snniferMensagens(msg));

client.initialize();