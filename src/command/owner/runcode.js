const { exec } = require('child_process');

module.exports = {
    name: "runcode",
    description: "Command Owner",
    cmd: ['$'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.body.arg) return
        
        exec(m.body.arg, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    }
}