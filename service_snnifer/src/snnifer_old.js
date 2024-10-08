const { Client } = require('whatsapp-web.js');

const axios = require('axios');

function initSnnifer(id) {

    const client = new Client({
        qrMaxRetries: 2,
        authTimeout: 120000
    });

    client.on('qr', async (qr) => {
        try {
            // links: [ { link: 'http://fancycoffee.fr', isSuspicious: false } ]
            // filehash: '1rl7nn6wQzQDR5qCK0RDL094P+m4zuQDmEFPsDOCDrI=',
            // encFilehash: '+w9Db2vgzOc05C1k8IKFIOD9J5jT3lpFHYmfvrNEGKM=',
            // size: 139213,
            if (qr != '') {
                await axios.post(`http://localhost:3333/usuario/${id}/inserir-qrcode`, {
                    tokenQrcode: qr
                });
                console.log('Token QRCODE:', qr);
                console.log('ID', id);
            }

        } catch (err) {
            // console.error('Erro ao cadastrar o TOKEN QRCODE:', err);
        }
    });

    client.on('ready', async () => {
        console.log('[DEBUG] Cliente se CONECTOU ao \"Cliente Personalizado\".');
        try {
            await axios.post(`http://localhost:3333/usuario/${id}/iniciar-instancia`);
        } catch (error) {
            // console.log(error);
            return res.status(404).send({
                message: "Falha ao iniciar a sessão o usuário",
                status_code: 404
            });
        }
    });

    client.on('disconnected', async () => {
        console.log('[DEBUG] Cliente se DESCONECTOU ao \"Cliente Personalizado\".');
        try {
            await axios.post(`http://localhost:3333/usuario/${id}/encerrar-instancia`);
        } catch (error) {
            // console.log(error);
            return res.status(404).send({
                message: "Falha ao iniciar a sessão o usuário",
                status_code: 404
            });
        }
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
            console.log(msg);
            // Envio de mensagem para análise de inteligência
            const resposta_inteligencia = await axios.post(`http://localhost:4444/analise-mensagem`, dados_analise);

            if (resposta_inteligencia.data.status_code != 200) {
                return false;
            }

            // Salvando dados do SCORE
            msg.fraudeScore = resposta_inteligencia.data.data.fraudeScore;
            msg.fraudePorcentagem = resposta_inteligencia.data.data.fraudePorcentagem;

            // Cadastro de mensagem no banco
            await axios.post(`http://localhost:3333/usuario/${resposta.data.data.usuario._id}/mensagem`, { message: msg });

        } catch (error) {
            // console.log(error);
        }

    }

    // Só pega as mensagens recebidas
    client.on('message', msg => snniferMensagens(msg));

    client.initialize();

}

module.exports = initSnnifer;