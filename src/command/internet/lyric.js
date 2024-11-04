const { default: axios } = require("axios")

module.exports = {
    name: "internet-lyric",
    description: "Mencari Lyric Music",
    cmd: ['lyric', 'lyrics'],
    menu: {
        label: 'internet'
    },
    run: async ({ m, sock }) => {
        m._react(m.key, '🔍')
        const res = await axios.get("https://api.nyxs.pw/tools/lirik?title="+m.body.arg)
        await m._reply(res.data.result)
        m._react(m.key, '✅')
    }
}