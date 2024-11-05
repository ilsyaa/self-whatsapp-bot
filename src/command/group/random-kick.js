const { delay } = require('@whiskeysockets/baileys')

module.exports = {
    name : "group-random-kcik",
    description : "Random Kick Participant From Group",
    cmd : ['randomkick', 'rkick'],
    menu : {
        label : 'group',
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.db.group?.activity_record) return m._reply(m.lang(msg).inactive)
            if(!m.body.arg) return m._reply(m.lang(msg).ex)
            let [ score, member ] = m.body.arg.split(' ')
            if(!member || !score) return m._reply(m.lang(msg).ex)

            score = parseInt(score)
            member = parseInt(member)
            if(member < 1) return m._reply(m.lang(msg).ex)

            let kicked = 0
            let mmm = 0;
            if(score == 0){
                let members = m.isGroup.groupMetadata.participants.filter(v => v.admin !== 'superadmin' && v.admin !== 'admin')
                members = members.filter(v => !m.db.group.member_activity[v.id] )
                mmm = members.length
                for(let i = 0; i < member; i++){
                    let random = Math.floor(Math.random() * members.length)
                    if(mmm == 0) break
                    await delay(1000)
                    await sock.groupParticipantsUpdate(m.chat, [members[random].id], "remove")
                    mmm--
                    kicked++
                }
                m._reply(m.lang(msg).success.replace('{kicked}', kicked))
            } else {
                let members = m.db.group.member_activity
                members = Object.entries(members).filter(v => v[1] == score)
                mmm = members.length
                for(let i = 0; i < member; i++){
                    let random = Math.floor(Math.random() * members.length)
                    if(mmm == 0) break
                    await delay(1000)
                    await sock.groupParticipantsUpdate(m.chat, [members[random][0]], "remove")
                    mmm--
                    kicked++
                }
                m._reply(m.lang(msg).success.replace('{kicked}', kicked))
            }
            
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan:\n\n{prefix}randomkick `score` `member`\n\n*Keterangan:*\n- *score*: Skor aktivitas anggota.\n- *member*: jumlah anggota yang akan di-kick.',
        inactive: 'Group ini tidak mengaktifkan fitur activity record.',
        success: 'Berhasilang mengeluarkan {kicked} anggota.'
    },
    en: {
        ex: 'Usage:\n\n{prefix}random-kick `score` `member`\n\n*Description:*\n- *score*: Member activity score.\n- *member*: Mention the member you want to kick.',
        inactive: 'This group does not have activity record feature.',
        success: 'Kicked {kicked} members.'
    }
}
