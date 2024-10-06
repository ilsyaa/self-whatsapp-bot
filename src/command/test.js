const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name : "test",
    description : "-",
    cmd : ['test222222'],
    run : async({ m, sock }) => {
        // if(!m.isGroup) return
        const sentMsg  = await m._sendMessage(
            m.chat, 
            { location: { degreesLatitude: 24.121231, degreesLongitude: 55.1121221 } }
        )
        await sock.sendMessage(m.chat, {
            react: {
                text: '👋',
                key: sentMsg.key
            }
        })
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