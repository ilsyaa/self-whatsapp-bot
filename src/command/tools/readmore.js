module.exports = {
    name : "readmore",
    description : "Read More",
    cmd : ['readmore', 'spoiler'],
    menu : {
        label : 'tools',
        example : '`<text>|<text>`'
    },
    run : async({ m, sock }) => {
        let [l, r] = m.body.arg.split('|');
        if (!l && !r) return m._reply(m.lang(msg).ex);
        if (!l) l = '';
        if (!r) r = '';
        const more = String.fromCharCode(8206);
        const readMore = more.repeat(4001);
        m._reply(l + readMore + r);
    }
}

const msg = {
    id: {
        ex: 'Penggunaan {prefix}readme <text>|<text>',
    },
    en: {
        ex: 'Usage {prefix}readme <text>|<text>',
    }
}