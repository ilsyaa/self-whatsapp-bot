const { default: axios } = require("axios")

module.exports = {
    name: "internet-gempa",
    description: "Menampilkan informasi gempa dari bmkg",
    cmd: ['gempa'],
    menu: {
        label: 'internet'
    },
    run: async ({ m, sock }) => {
        m._react(m.key, '🔍')
        const res = await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json")
        const gempa = res.data.Infogempa.gempa;
        let caption = `*${gempa.Wilayah}*\n\n`
		caption += `Tanggal : ${gempa.Tanggal}\n`
		caption += `Waktu : ${gempa.Jam}\n`
		caption += `Potensi : *${gempa.Potensi}*\n\n`
		caption += `Magnitude : ${gempa.Magnitude}\n`
		caption += `Kedalaman : ${gempa.Kedalaman}\n`
		caption += `Koordinat : ${gempa.Coordinates}${gempa.Dirasakan.length > 3 ? `\nDirasakan : ${gempa.Dirasakan}` : ''}`
        await m._sendMessage(m.chat, { image : { url : "https://data.bmkg.go.id/DataMKG/TEWS/"+gempa.Shakemap }, caption }, { quoted: m })
        m._react(m.key, '✅')
    }
}