const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name : "test",
    description : "-",
    cmd : ['test'],
    run : async({ m, sock }) => {
        if(!m.isGroup) return
        // const leaveApiUrl = 'https://i.ibb.co.com/HrxxcJV/trol.png'
        // console.log(await sock.fetchStatus(m.sender))
        // m._sendMessage(m.chat, {
        //     text: 'Selamat datang',
        //     contextInfo: {
        //         mentionedJid: [m.sender],
        //         externalAdReply: {
        //             title: 'Test',
        //             body: "test",
        //             thumbnailUrl: leaveApiUrl,
        //             sourceUrl: '',
        //             mediaType: 1,
        //             renderLargerThumbnail: true
        //         }
        //     }
        // })
    }
}