const { NlpManager } = require('node-nlp');

const start = async ()  => {
    const manager = new NlpManager({ languages: ['id'], forceNER: true });

    manager.addDocument('id', 'buatkan sticker dari gambar ini', '/sticker');
    manager.addDocument('id', 'buatlan saya sticker dari gambar ini', '/sticker');
    manager.addDocument('id', 'convert gambar ini jadi sticker', '/sticker');
    manager.addDocument('id', 'jadikan sticker', '/sticker');
    manager.addDocument('id', 'make sticker', '/sticker');
    manager.addDocument('id', 'Buat stiker dari gambar ini', '/sticker');
    manager.addDocument('id', 'Tambahkan gambar ini ke stiker', '/sticker');
    manager.addDocument('id', 'Gambar ini jadi stiker', '/sticker');
    manager.addDocument('id', 'Jadikan gambar ini sebagai stiker', '/sticker');
    manager.addDocument('id', 'Konversi gambar ini ke stiker', '/sticker');
    manager.addDocument('id', 'Buatkan stiker dari foto ini', '/sticker');
    manager.addDocument('id', 'Ganti gambar ini jadi stiker', '/sticker');
    manager.addDocument('id', 'Simpan gambar ini sebagai stiker', '/sticker');
    manager.addDocument('id', 'Ubah gambar ini menjadi stiker', '/sticker');
    manager.addDocument('id', 'Buat stiker dari foto yang saya kirim', '/sticker');
    manager.addDocument('id', 'Hasilkan stiker dari gambar ini', '/sticker');
    manager.addDocument('id', 'Buatkan stiker dari image ini', '/sticker');
    manager.addDocument('id', 'Gambar ini, tolong buatkan stiker', '/sticker');
    manager.addDocument('id', 'Konversikan gambar ini jadi stiker', '/sticker');
    manager.addDocument('id', 'Jadikan foto ini stiker', '/sticker');
    manager.addDocument('id', 'Buat stiker dari gambar yang ada', '/sticker');
    manager.addDocument('id', 'Stiker dari gambar ini ya', '/sticker');
    manager.addDocument('id', 'Gambar ini untuk stiker', '/sticker');
    manager.addDocument('id', 'Jadikan gambar ini sebagai stiker baru', '/sticker');
    manager.addDocument('id', 'Buatkan stiker dari image ini', '/sticker');

    await manager.train();
    manager.save();

    const intent = async (text) => {
        const response = await manager.process('id', text);
        return response.intent
    }

    console.log(await intent('buatlan saya sticker dari gambar ini'))
    console.log(await intent('buatkan sticker dari gambar ini'))
    console.log(await intent('convert gambar ini jadi sticker'))
    console.log(await intent('jadikan sticker'))
    console.log(await intent('sticker'))
    
}

start()