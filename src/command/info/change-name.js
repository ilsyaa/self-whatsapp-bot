const db = require("../../utils/db.js")
const moment = require("../../utils/moment.js")

module.exports = {
    name: "info-change-name",
    description: "Change name user",
    cmd: ['changename', 'cn', 'cname', 'rename'],
    menu: {
        label: 'info',
        example: 'name'
    },
    run: async ({ m, sock }) => {
        const name = m.body.arg.replace(/[^A-Za-z ]/g, '');
        if(!name) return m._reply(m.lang(msg).ex);
        if(name.length < 3) return m._reply(m.lang(msg).min);
        await db.update(db.user, m.sender, { name, updated_at: moment() });
        await m._reply(m.lang(msg).success);
    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}cn `nama`',
        min: 'Minimal 3 huruf.',
        success: 'Nama kamu berhasil di perbarui.'
    },
    en: {
        ex: 'usage: {prefix}cn `name`',
        min: 'Minimal 3 character.',
        success: 'Your name has been successfully updated.'
    }
}