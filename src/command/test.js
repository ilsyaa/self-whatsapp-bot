const { createCanvas, loadImage } = require('canvas');
const { jidDecode, downloadContentFromMessage } = require('@whiskeysockets/baileys')

module.exports = {
    name : "test",
    description : "-",
    withoutPrefix: true,
    cmd : ['test'],
    run : async({ m, sock }) => {
        try {
            const stream = await downloadContentFromMessage({
                mediaKey : m.quoted.mediaKey,
                directPath : m.quoted.directPath,
                url : m.quoted.url,
            }, 'sticker', {});

            console.log(stream)
        } catch (error) {
            console.log(error)
        }


        // if(!m.isGroup) return
        // const sentMsg  = await m._sendMessage(
        //     m.chat, 
        //     { location: { degreesLatitude: 24.121231, degreesLongitude: 55.1121221 } }
        // )
        // await sock.sendMessage(m.chat, {
        //     react: {
        //         text: '👋',
        //         key: sentMsg.key
        //     }
        // })
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