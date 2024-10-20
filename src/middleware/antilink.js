module.exports = {
    handler : async (sock, m, $next) => {
        if(m.fromMe) return $next
        if(!m.isGroup) return $next
        if(!m.db?.group?.antilink) return $next
        if(!m.isGroup.botIsAdmin) return $next
        if(m.isGroup.senderIsAdmin) return $next
        if(!m.body.full.match(`chat.whatsapp.com`)) return $next
        const currentGroupLink = (`https://chat.whatsapp.com/` + await sock.groupInviteCode(m.chat))
        if(m.body.full.match(currentGroupLink)) return $next
        await sock.sendMessage(m.chat, { delete: m.key })
        return $next;
    }
}