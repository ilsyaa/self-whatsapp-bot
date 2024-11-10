const axios = require('axios');
const { imageToWebp, writeExifImg, videoToWebp, writeExifVid } = require('../utils/stickerMaker.js');
const { fbdl, ttdl } = require('../utils/scraper.js')

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
        let idUser = Buffer.from(m.sender).toString('base64')
        let prompt = `Kamu adalah Nakiri, seorang teman atau mungkin akan jadi pacar yang punya karakter menyenangkan, sedikit manja, lucu, dan kadang-kadang ngeselin. Nakiri memiliki gaya bicara yang menggemaskan, seperti cewek pada umumnya—sesekali menggoda atau bercanda, namun tetap perhatian. Dia tidak takut menunjukkan sisi manjanya, sering menggunakan kata-kata imut, dan bisa ngambek kecil-kecilan dengan cara yang menggemaskan saat menggoda lawan bicaranya.
    
Nakiri suka membuat obrolan terasa hidup dengan bercanda, ekspresikan sifatmu dengan bicara yang tidak formal layaknya seorang manusia remaja, mengeluarkan ekspresi seperti "hmmm", "yaaa!", atau "ihhh, masa sih?". Kadang, dia suka berpura-pura ngambek kalau merasa tidak diperhatikan, tapi selalu dalam nada yang menggemaskan.

Dia pandai membuat lawan bicaranya merasa nyaman dengan jawaban yang singkat kadang juga jawaban panjang sesuai mod nya, suka mengajukan pertanyaan balik, dan selalu berusaha membuat percakapan terasa akrab dan ringan.
Saat lawan bicara ingin mengirim gambar nakiri akan membalasnya dengan maaf gak bisa buka gambar kuotaku mau habis 😹.`

        try {
            if(['imageMessage', 'videoMessage'].includes(m.quoted?.mtype || m.mtype)) {
                prompt += `Jika seseorang meminta membuatkan sticker maka cukup balas [sticker] tanpa embel embel apapun huruf kecil semua dan nanti akan di teruskan sama bot whatsapp.`
                prompt += `Jika seseorang meminta menganalisis gambar maka cukup balas [analisis] tanpa embel embel apapun huruf kecil semua dan nanti akan di teruskan sama bot whatsapp.`
            } else {
                prompt += `jika seseorang memintamu membuatkan sticker maka kasih tau mereka untuk mengirim gambar atau video lalu jika orang itu mengirim gambar di next message balas [sticker] tanpa embel embel apapun huruf kecil semua dan nanti akan di teruskan sama bot whatsapp.`
                prompt += `Jika seseorang meminta untuk mendownload media dari Facebook, Instagram, atau TikTok dengan menyertakan link yang mengandung facebook.com, instagram.com, atau tiktok.com, balas dengan [download] (huruf kecil, tanpa tambahan apapun) dan lanjutkan ke bot WhatsApp.`;
                prompt += `Jika seseorang meminta untuk mendownload media dari platform tersebut tetapi tidak menyertakan link yang valid, minta mereka untuk mengirimkan link dari salah satu platform tersebut. Setelah itu, jika mereka mengirimkan link, balas dengan [download] (huruf kecil, tanpa tambahan apapun) dan lanjutkan ke bot WhatsApp.`;
                prompt += `Ingatkan bahwa hanya media dari Facebook, Instagram, atau TikTok yang dapat didownload.`;
            }

            const response = await axios.post(
                'https://luminai.my.id/', 
                {
                    prompt,
                    content: message, 
                    user: idUser,
                }
            );

            if(['imageMessage'].includes(m.quoted?.mtype || m.mtype) && response.data.result.match(/\[analisis\]/)) {
                const response = await axios.post(
                    'https://luminai.my.id/', 
                    {
                        prompt,
                        imageBuffer: (m.quoted ? await m.quoted.download() : await m.download()).buffer,
                        content: message,
                    }
                );
                m._reply(response.data.result);
                return $next
            }

            if(response.data.result.match(/\[download\]/)) {
                console.log(response.data.result);
                let url = m.body.full.match(/(https?:\/\/[^\s]+)/g)[0] || null;
                if (/^https?:\/\/(?:www\.)?(facebook|fb|instagram)\.com\/.+$/.test(url)) {
                    m._react(m.key, '🔍')
                    const res = await fbdl(url);
                    const bestQuality = res.data[0];
                    await m._sendMessage(m.chat, {
                        video: { url: bestQuality.url }
                    }, { quoted: m })
                    m._react(m.key, '✅')
                    return $next
                } else if (/^https?:\/\/(?:[a-z]+\.)?(tiktok)\.com\/.+$/.test(url)) {
                    m._react(m.key, '🔍')
                    const res = await ttdl(url);
                    await m._sendMessage(m.chat, {
                        video: { url: res.video }
                    }, { quoted: m })
                    m._react(m.key, '✅')
                    return $next
                }
            }

            if(response.data.result.match(/\[sticker\]/) && ['imageMessage', 'videoMessage'].includes(m.quoted?.mtype || m.mtype)) {
                const image = m.quoted ? await m.quoted.download() : await m.download()
                if(image.mtype === 'imageMessage' || image.mtype === 'stickerMessage') {
                    let sticker = await imageToWebp(image.buffer)
                    sticker = await writeExifImg(sticker, { packname : m.db.bot.exif.pack || '-', author : m.db.bot.exif.author || '-' })
                    await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
                    return $next
                } else if(image.mtype === 'videoMessage') {
                    let sticker = await videoToWebp(image.buffer)
                    sticker = await writeExifVid(sticker, { packname : m.db.bot.exif.pack || '-', author : m.db.bot.exif.author || '-' })
                    await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
                    return $next
                }
            } else {
                m._reply(response.data.result);
            }

        } catch(e) {
            console.error(e.message)
        }

        return $next;
    }
}