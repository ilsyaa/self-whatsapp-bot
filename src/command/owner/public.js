const { exec } = require('child_process');

module.exports = {
    name: "self",
    description: "Self Bot",
    cmd: ['self'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.body.arg) return
        
        if(m.body.arg == '0') {
            sock.public = true
            await m._reply(`self off`)
        } else {
            sock.public = false
            await m._reply(`self on`)
        }
    }
}