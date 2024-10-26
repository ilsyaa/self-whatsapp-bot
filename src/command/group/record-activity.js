const db = require('../../utils/db.js')

module.exports = {
    name : "group-activity",
    description : "Mengaktifkan dan menonaktifkan Activity record group",
    cmd : ['grecord', 'activity'],
    menu : {
        label : 'group',
        example : '<enable/disable>'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.body.arg) return m._reply(m.lang(msg).ex)

            if(m.body.arg == 'enable' || m.body.arg == 'on' || m.body.arg == 'true') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { activity_record: true })
                await m._reply(m.lang(msg).active)
            } else if(m.body.arg == 'disable' || m.body.arg == 'off' || m.body.arg == 'false') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { activity_record: false })
                await m._reply(m.lang(msg).inactive)
            } else {
                await m._reply(m.lang(msg).ex)
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan: {prefix}grecord `<enable/disable>`\n\n*Keterangan:*\n- *enable*: Bot akan merecord aktivitas member group.\n- *disable*: Bot tidak akan merecord aktivitas member group.',
        active: 'Record aktivitas member group telah diaktifkan.',
        inactive: 'Record aktivitas member group telah dinonaktifkan.'
    },
    en: {
        ex: 'Usage: {prefix}grecord `<enable/disable>`\n\n*Keterangan:*\n- *enable*: Bot will record group member activity.\n- *disable*: Bot will not record group member activity.',
        active: 'Group member activity recording has been activated.',
        inactive: 'Group member activity recording has been deactivated.'
    }
}
