const config = require('../../config');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const PromptFitures = new Map();

const generatePrompt = async () => {
    let fitur = {};
    return `
Anda adalah asisten AI yang berperan sebagai bot WhatsApp. Tugas Anda adalah meneruskan manusiawi ke perintah yang di pahami command bot.
### Fitur Bot:
Setiap fitur disusun dalam format JSON sebagai berikut:
${JSON.stringify(fitur, null, 2)}

Ketentuan Fitur:
- name adalah rincian atau penjelasan sebuah fitur.
- description adalah deskripsi sebuah fitur, isinya mengenai fitur tersebut dan apa yang perlu bot lakukan.
- response adalah perintah yang di pahami command bot.
- jadi saat seseorang meminta fitur tertentu, kamu sebagai ai hanya perlu meneruskan perintah yang di pahami command bot dan sudah saya set di response.
- saya ingin kamu hanya perlu menjawab sesuai dengan isi response
- jika seseorang meminta di luar dari list fitur di atas, berikan response false dalam bentuk JSON

Batasan:
1. Jangan memberikan informasi pribadi atau palsu
2. Selalu gunakan bahasa yang sopan dan sesuai untuk semua usia

Respon dalam bahasa Indonesia kecuali diminta menggunakan bahasa Inggris.
`
}

const IntegrateAI = async (config) => {
    PromptFitures.set(config.name, {
        name: config.name,
        description: config.condition,
        response: config.response
    });
}

const geneterateCommandAI = async (text) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const BOT_PROMPT = await generatePrompt();
    const chat = model.startChat({
        history: [
            { role: "user", parts: [{ text: BOT_PROMPT }] },
            { role: "model", parts: [{ text: "Baik, saya mengerti peran saya sebagai asisten multi-fungsi. Saya siap membantu pengguna dengan berbagai tugas yang Anda sebutkan." }] },
        ],
    });

    const result = await chat.sendMessage(text);
    return result.response.text();
}

module.exports = { geneterateCommandAI, IntegrateAI }