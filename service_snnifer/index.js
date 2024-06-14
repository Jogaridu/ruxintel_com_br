const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

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

// Só pega as mensagens recebidas
client.on('message', msg => {
    console.log(msg);
    console.log(msg.body);
    // if (msg.body == '!ping') {
    //     msg.reply('pong');
    // }
});

client.initialize();