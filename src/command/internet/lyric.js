const { default: axios } = require("axios")
const db = require("../../utils/db.js")

module.exports = {
    name: "internet-lyric",
    description: "Mencari Lyric Music",
    cmd: ['lyric', 'lyrics'],
    menu: {
        label: 'internet'
    },
    limit: 5,
    run: async ({ m, sock }) => {
        m._react(m.key, '🔍')
        const res = await axios.get("https://api.nyxs.pw/tools/lirik?title="+m.body.arg)
        await m._reply(res.data.result)
        m._react(m.key, '✅')
        db.update(db.user, m.sender, { limit: (parseInt(m.db.user.limit) - parseInt(m.commandLimit)) });
    }
}