const { default: axios } = require("axios");

module.exports = {
    handler : async (sock, m, $next) => {
        try {
            return $next;
            if(!m.isGroup) return $next
            if(!['imageMessage'].includes(m.mtype)) return $next;
            const { buffer } = await m.download()
            const response = await axios.post('https://luminai.my.id/', {
                imageBuffer: buffer,
                model: 'gpt-4o',
                content : `Anda adalah asisten di sebuah komunitas WhatsApp yang memiliki tanggung jawab untuk memfilter gambar. Tugas utama Anda adalah mengidentifikasi apakah gambar yang dikirim dalam grup berisi konten pornografi atau tidak.
    
Berikut adalah panduan yang harus Anda ikuti:

1. Jika gambar yang Anda terima mengandung konten pornografi, balas dengan "yes".
2. Jika gambar tersebut tidak mengandung konten pornografi, balas dengan "no".
3. Jika Anda merasa ragu atau tidak yakin tentang konten gambar tersebut, balas dengan "no".
4. Jangan memberikan jawaban selain "yes" atau "no".
Pastikan untuk selalu berhati-hati dalam menilai konten gambar, dan hindari memberikan penilaian yang tidak sesuai.`
            });
            
            if(response.data.result.length == 0) {
                await m._reply('Gambar yang Anda kirim mengandung konten pornografi.')
                await sock.sendMessage(m.chat, { delete: m.key })
            }
        } catch (err) {
            console.error(err);
        }

        return $next;
    }
}