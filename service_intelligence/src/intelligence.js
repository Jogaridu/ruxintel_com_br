const axios = require('axios');

require("dotenv").config()

async function intelligenceAnalyse(packet) {

    console.log(`[DEBUG] Nova mensagem identificada: ${packet}`);

    // OPEN AI API
    const OPENAI_URI = "https://api.openai.com/v1";
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    // CHAT PROMPT
    const CHAT_PROMPT_TEMPLATE = `Baseado na mensagem a seguir, determine se ela pode ou não ser uma fraude.\n\nUtilize esses parâmetros para avaliação (totalizando 10 pontos):\n- DDD do contato não é do Brasil (1 ponto)\n- Chave PIX presente na mensagem (2 pontos)\n- Palavras-chave comuns em golpes: "garanta sua reserva", "24h", "ganhe", etc. (2 pontos)\n- Emojis presentes na mensagem (1 ponto)\n- Solicitação de dados pessoais explícita ou implícita (3 ponto)\n- URL suspeita que força o cliente a clicar (1 ponto)\n\nMensagem do possível fraudador: "${packet.contatoMensagem}"\n\nRetorne a resposta no formato JSON sem code block:\n{\n     "fraudeScore": <valor numérico entre 0 e 10>,\n     "fraudePorcentagem": <valor inteiro baseado no fraudeScore, ex.: 0% a 100%>,\n     "fraudeMensagem": <mensagem explicando a razão da pontuação e se a mensagem é considerada fraude ou não>\n}`;

    // CONSUMINDO API
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
        console.log(`[DEBUG] Mensagem segura: ${fraudeScore} | Chance: ${fraudePorcentagem}% | Mensagem: ${packet.contatoMensagem}`);
    } else {
        console.log(`[DEBUG] Fraude identiticada: ${fraudeScore} | Chance: ${fraudePorcentagem}% | Mensagem: ${packet.contatoMensagem}`)
    }

    return jsonObject;

}

module.exports = intelligenceAnalyse;