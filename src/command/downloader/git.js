const { default: axios } = require('axios');
const mime = require('mime-types');
const db = require('../../utils/db.js');

module.exports = {
    name: "downloader-gitclone",
    description: "Git Clone Repo Github",
    cmd: ['git', 'gitclone'],
    menu: {
        label: 'downloader',
        example: 'url'
    },
    limit: 1,
    run: async ({ m, sock }) => {
        if (!m.body.arg) return m._reply(m.lang(msg).ex)

        const url = m.body.arg;
        const user = url.split('/')[3];
        const repo = url.split('/').pop().split('.git')[0];
        if(!user || !repo) return m._reply(m.lang(msg).urlInvalid)
        
        m._react(m.key, '🔍')
        axios.get(`https://api.github.com/repos/${user}/${repo}/zipball`, { responseType: 'arraybuffer' }).then(async(res) => {
            await m._sendMessage(m.chat, { 
                document: res.data,
                fileName: `${repo}.zip`,
                mimetype: mime.lookup(`${repo}.zip`),
            }, { quoted: m })
            db.update(db.user, m.sender, { limit: (parseInt(m.db.user.limit) - parseInt(m.commandLimit)) });
            m._react(m.key, '✅')
        }).catch(e => {
            m._react(m.key, '❌')
            m._reply(e.message)
        })
    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}git `<url>`',
        urlInvalid: 'URL tidak valid'
    },
    en: {
        ex: 'usage: {prefix}git `<url>`',
        urlInvalid: 'URL not valid'
    }
}