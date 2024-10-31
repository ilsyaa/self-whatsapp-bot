const os = require('os')
const fs = require('fs')

function toTime(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    let days = Math.floor(ms / (1000 * 60 * 60 * 24))

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

function formatSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

module.exports = {
    name: "info-ping",
    description: "Ping",
    cmd: ['ping', 'p'],
    menu: {
        label: 'info'
    },
    run: async ({ m, sock }) => {
        let start = performance.now();
        let text = `*\`❖ Server Info\`*\n`;
        text += `▷ Running On : ${process.env.username === 'root' ? "VPS" : "HOSTING ( PANEL )"}\n`
        text += `▷ Node Version : ${process.version}\n\n`
        text += `*\`❖ Management Server\`*\n`
        text += `▷ Speed : ${(performance.now() - start).toFixed(5)} ms\n`
        text += `▷ Uptime : ${toTime(process.uptime() * 1000)}\n`
        text += `▷ Total Memory : ${formatSize(os.freemem())}/${formatSize(os.totalmem())}\n`
        text += `▷ CPU : ${os.cpus()[0].model} ( ${os.cpus().length} CORE )\n`
        text += `▷ Release : ${os.release()}\n`
        text += `▷ Type : ${os.type()}`
        m._reply(text);
    }
}
