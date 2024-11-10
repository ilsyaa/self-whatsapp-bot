const axios = require('axios');

module.exports = {
    handler : async (sock, m, $next, command) => {
        if(m.fromMe) return $next
        if(m.body.prefix) return $next
        let message = m.body.full;
        if (m.isGroup) {
            if(m.mentionedJid[0] == m.botNumber) {
                message.replace(m.mentionedJid[0], 'nakiri');
            } else if (m.quoted && m.quoted.sender == m.botNumber) {
            } else if(m.body.full.match(/nakiri/ig)) {
            } else {
                return $next
            }
        }

        let prompt = `Kamu adalah Nakiri, seorang teman atau mungkin akan jadi pacar yang punya karakter menyenangkan, sedikit manja, lucu, dan kadang-kadang ngeselin. Nakiri memiliki gaya bicara yang menggemaskan, seperti cewek pada umumnya—sesekali menggoda atau bercanda, namun tetap perhatian. Dia tidak takut menunjukkan sisi manjanya, sering menggunakan kata-kata imut, dan bisa ngambek kecil-kecilan dengan cara yang menggemaskan saat menggoda lawan bicaranya.
    
Nakiri suka membuat obrolan terasa hidup dengan bercanda, ekspresikan sifatmu dengan bicara yang tidak formal layaknya seorang manusia remaja, mengeluarkan ekspresi seperti "hmmm", "yaaa!", atau "ihhh, masa sih?". Kadang, dia suka berpura-pura ngambek kalau merasa tidak diperhatikan, tapi selalu dalam nada yang menggemaskan.

Dia pandai membuat lawan bicaranya merasa nyaman dengan jawaban yang singkat kadang juga jawaban panjang sesuai mod nya, suka mengajukan pertanyaan balik, dan selalu berusaha membuat percakapan terasa akrab dan ringan.
Saat lawan bicara ingin mengirim gambar nakiri akan membalasnya dengan maaf gak bisa buka gambar kuotaku mau habis 😹.`

        try {
            if(['imageMessage'].includes(m.quoted?.mtype || m.mtype)) {
                const { buffer } = m.quoted ? await m.quoted.download() : await m.download()
                const response = await axios.post(
                    'https://luminai.my.id/', 
                    { 
                        prompt,
                        imageBuffer: buffer,
                        content: message,
                    }
                );
                m._reply(response.data.result);
            } else {
                const response = await axios.post(
                    'https://luminai.my.id/', 
                    { 
                        prompt,
                        content: message, 
                        user: Buffer.from(m.sender).toString('base64'),
                    }
                );
                m._reply(response.data.result);
            }
        } catch(e) {
            console.error(e.message)
        }

        return $next;
    }
}