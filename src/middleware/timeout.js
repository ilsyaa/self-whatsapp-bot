module.exports = {
    handler : async (sock, m, $next) => {
        if(m.fromMe) return $next
        if(!m.isGroup) return $next
        if(!m.db?.group?.timeouts) return $next
        if(!m.isGroup.botIsAdmin) return $next
        if(m.isGroup.senderIsAdmin) return $next
    
        if(Object.keys(m.db.group?.timeouts || {}).find(x => x == m.sender)) {
            await sock.sendMessage(m.chat, { delete: m.key })
            throw {
                break: false,
                continueCommand: false,
                message: 'Kamu sedang timeout di grup ini',
            }
        }
    
        return $next;
    }
}


/* 
break:
jika true dia tidak akan menjalankan middleware selanjutnya.
jika false dia tetap akan menjalankan middleware selanjutnya.

continueCommand:
jika true dia akan tetap akan menjalankan command
jika false dia tidak akan menjalankan command

throw {
    break: true,
    continueCommand: false,
    message: 'Kamu sedang timeout di grup ini',
}
*/