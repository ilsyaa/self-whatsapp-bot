const { exec } = require('child_process');

module.exports = {
    name: "self",
    description: "Self Bot",
    cmd: ['self'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.body.arg) return
        
        if(m.body.arg == 'on') {
            sock.public = true
        } else {
            sock.public = false
        }
        await m._reply(`self ${!sock.public ? 'on' : 'off'}`)
    }
}