const { exec } = require('child_process');

module.exports = {
    name: "eval",
    description: "Command Owner",
    cmd: ['$'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.body.arg) return

        m._reply('_Executing..._')
        exec(m.body.arg, async (err, stdout) => {
            if (err) return m._reply(`${err}`)
            if (stdout) m._reply(`${stdout}`)
        })
    }
}