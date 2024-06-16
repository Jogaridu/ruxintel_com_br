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
    // console.log(msg);
    // const celular_usuario_destino = msg.to.split('@')[0];

    // try {

    //     const resposta = await axios.get(`http://localhost:3333/usuario/${celular_usuario_destino}`);

    //     if (resposta.data.status_code != 200) {
    //         // return res.status(404).send({
    //         //     message: "Usuário inválido",
    //         //     status_code: 404,
    //         // });
    //     }

    //     const resposta_mensagem = await axios.post(`http://localhost:3333/usuario/${resposta.data.data.usuario._id}/mensagem`, { message: msg });

    // } catch (error) {
    //     console.log(error);
    // }

    packet = {
        "contatoNome": msg._data.notifyName,
        "contatoMensagem": msg._data.body,
        "contatoNumero": msg._data.from,
        "clienteNumero": msg._data.to
    }

    console.log(`[DEBUG] Nova mensagem identificada: ${packet}`);

    // OPEN AI API
    const OPENAI_URI="https://api.openai.com/v1";
    const OPENAI_API_KEY="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";

    // CHAT PROMPT
    const CHAT_PROMPT_TEMPLATE = `Baseado na mensagem a seguir, determine se ela pode ou não ser uma fraude.\n\nUtilize esses parâmetros para avaliação (totalizando 10 pontos):\n- DDD do contato não é do Brasil (1 ponto)\n- Chave PIX presente na mensagem (2 pontos)\n- Palavras-chave comuns em golpes: "garanta sua reserva", "24h", "ganhe", etc. (2 pontos)\n- Emojis presentes na mensagem (1 ponto)\n- Solicitação de dados pessoais explícita ou implícita (3 ponto)\n- URL suspeita que força o cliente a clicar (1 ponto)\n\nMensagem do possível fraudador: "${packet.contatoMensagem}"\n\nRetorne a resposta no formato JSON sem code block:\n{\n     "fraudeScore": <valor numérico entre 0 e 10>,\n     "fraudePorcentagem": <valor inteiro baseado no fraudeScore, ex.: 0% a 100%>,\n     "fraudeMensagem": <mensagem explicando a razão da pontuação e se a mensagem é considerada fraude ou não>\n}`;


    // CONSUMINDO API
    try {
        const data = {
            model: "gpt-4o",
            messages: [
                {
                    "role": "system",
                    "content": CHAT_PROMPT_TEMPLATE
                }
            ]
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post(`${OPENAI_URI}/chat/completions`, data, config);
        const jsonObject = JSON.parse(response.data.choices[0].message.content);

        const fraudeScore = jsonObject.fraudeScore;
        const fraudePorcentagem = jsonObject.fraudePorcentagem;
        const fraudeMensagem = jsonObject.fraudeMensagem;

        // VERIFICAÇÃO
        if (jsonObject.fraudeScore <= 6) {
            console.log(`[DEBUG] Fraude identiticada: ${fraudeScore} | Chance: ${fraudePorcentagem}% | Mensagem: ${packet.contatoMensagem}`);
            console.log(`[DEBUG] Salvando no banco de dados...`)
        } else {
            console.log(`[DEBUG] Mensagem segura: ${fraudeScore} | Chance: ${fraudePorcentagem}% | Mensagem: ${packet.contatoMensagem}`)
        }

        console.log(jsonObject)

    } catch (error) {
        console.log(`[ERROR] Erro ao consumir API da OpenAI: ${error}`);
    }
}

// Só pega as mensagens recebidas
client.on('message', msg => snniferMensagens(msg));

client.initialize();