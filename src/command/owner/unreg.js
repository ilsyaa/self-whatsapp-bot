const db = require("../../utils/db.js")
const moment = require("../../utils/moment.js")

module.exports = {
    name: "info-unregister-user",
    description: "Unregister User",
    cmd: ['unreg'],
    menu: {
        label: 'info',
        example: '@mention'
    },
    run: async ({ m, sock }) => {
        let id;
        if(m.quoted) id = m.quoted.sender;
        else if(m.mentionedJid.length) id = m.mentionedJid[0];
        else return m._reply(m.lang(msg).ex);
        const user = await db.user.get(id);
        if(!user) return m._reply(m.lang(msg).userNotFound);
        await db.user.remove(id);
        await m._reply(m.lang(msg).success.replace('{name}', user.name));
    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}unreg `@mention`',
        success: '{name} telah di hapus dari database.',
        userNotFound: 'user tidak ditemukan.'
    },
    en: {
        ex: 'usage: {prefix}unreg `@mention`',
        success: '{name} has been removed from database.',
        userNotFound: 'user not found.'
    }
}