const { default: axios } = require("axios")

module.exports = {
    name : "anime-info",
    description : "Search Anime by title",
    cmd : ['animeinfo'],
    menu : {
        label : 'anime',
        example : "_<text>_",
    },
    run : async({ m, sock }) => {
        try {
            if(!m.body.arg) return m._reply(m.lang(msg).ex)
            const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(m.body.arg)}`)
            if(res.data.data.length == 0) return m._reply(m.lang(msg).notFound)
            let anime = res.data.data[0]
            let genreList = anime.genres.map((genre) => genre.name).join(', ');
            let caption = `*${anime.title}*\nJapan: ${anime.title_japanese}\nType: ${anime.type}\nGenres: ${genreList}\nScore: ${anime.score}\nStatus: ${anime.status}\n\n_${anime.url}_`
            await m._sendMessage(m.chat, { image : { url : res.data.data[0].images.jpg.image_url }, caption }, { quoted: m })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}animeinfo `judul anime`',
        notFound: 'Anime Tidak ditemukan'
    },
    en: {
        ex: 'usage: {prefix}animeinfo `judul anime`',
        notFound: 'Anime not found'
    }
}