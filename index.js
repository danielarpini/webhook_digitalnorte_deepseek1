const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

app.post('/webhook', async (req, res) => {
  const pergunta = req.body.mensagem || req.body.message;

  const payload = {
    model: "deepseek-chat",
    messages: [
      {
        role: "user",
        content: `Responda como atendente da Digital Norte. Seja direto, humano e respeitoso. Explique o que for necessário sobre certificado digital, instalação, suporte, ACs (Soluti, Valid, Safeweb, Serpro, Syngular). Pergunta: ${pergunta}`
      }
    ]
  };

  try {
    const resposta = await axios.post('https://api.deepseek.com/chat/completions', payload, {
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const respostaTexto = resposta.data.choices[0].message.content;
    return res.json({ resposta: respostaTexto });

  } catch (err) {
    console.error("Erro com DeepSeek:", err.response?.data || err.message);
    return res.status(500).json({ erro: "Erro ao acessar DeepSeek" });
  }
});

app.get('/', (req, res) => {
  res.send("Webhook da Digital Norte rodando com DeepSeek.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});