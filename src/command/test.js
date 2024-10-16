const { createCanvas, loadImage } = require('canvas');
const { jidDecode, downloadContentFromMessage, downloadMediaMessage } = require('@whiskeysockets/baileys');
const db = require('../utils/db');
const { default: axios } = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = {
    name: "test",
    description: "-",
    withoutPrefix: true,
    cmd: ['test'],
    run: async ({ m, sock }) => {
        await sock.sendMessage(m.chat, {
            text: 'Done',
            contextInfo: {
                externalAdReply: {
                    title: 'Nakiri Whatsapp BOT',
                    body: '- Menu -',
                    mediaType: 2,
                    thumbnail: fs.readFileSync(path.join(config.STORAGE_PATH, 'assets/icon-message.jpg')),
                    sourceUrl: 'https://velixs.com', 
                }
            }
        }, { quoted: m });

        return;

        // await sock.sendMessage(m.chat, {
        //     document: fs.readFileSync('./package.json'),
        //     thumbnailUrl: 'https://telegra.ph/file/14f21fc7574b00a753376.jpg',
        //     mimetype: 'application/pdf',
        //     fileLength: 99999,
        //     pageCount: '100',
        //     fileName: `𝑨𝒓𝒄𝒉 𝑴𝒅 𝑨𝒊 ☘`,
        //     caption: 'testcaption',
        //     contextInfo: {
        //         externalAdReply: {
        //             showAdAttribution: false,
        //             title: `© Welcome Message`,
        //             body: `testd`,
        //             thumbnailUrl: 'https://telegra.ph/file/14f21fc7574b00a753376.jpg',
        //             sourceUrl: 'https://chat.whatsapp.com/HO2JGN8YHr9IOf4XOSRhGe',
        //             mediaType: 1,
        //             renderLargerThumbnail: true
        //         }
        //     }
        // });
        // m._reply(JSON.stringify(db.group.get(m.isGroup.groupMetadata.id)))

        // try {
        //     const stream = await downloadContentFromMessage({
        //         mediaKey: m.quoted.mediaKey,
        //         directPath: m.quoted.directPath,
        //         url: m.quoted.url,
        //     }, 'sticker', {});

        //     console.log(stream)
        // } catch (error) {
        //     console.log(error)
        // }


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