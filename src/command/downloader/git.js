const { default: axios } = require('axios');
const mime = require('mime-types');

module.exports = {
    name: "downloader-gitclone",
    description: "Git Clone Repo Github",
    cmd: ['git', 'gitclone'],
    menu: {
        label: 'downloader',
        example: 'url'
    },
    run: async ({ m, sock }) => {
        if (!m.body.arg) return m._reply(m.lang(msg).ex)

        const url = m.body.arg;
        const user = url.split('/')[3];
        const repo = url.split('/').pop().split('.git')[0];
        if(!user || !repo) return m._reply(m.lang(msg).urlInvalid)
        
        axios.get(`https://api.github.com/repos/${user}/${repo}/zipball`, { responseType: 'arraybuffer' }).then((res) => {
            m._sendMessage(m.chat, { 
                document: res.data,
                fileName: `${repo}.zip`,
                mimetype: mime.lookup(`${repo}.zip`),
            }, { quoted: m })
        }).catch(e => {
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