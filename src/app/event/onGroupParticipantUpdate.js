const { createCanvas, loadImage } = require('canvas');
const db = require('../../utils/db.js');
const fs = require('node-webpmux/io');

module.exports = groupParticipant = async (sock) => {
    sock.ev.on('group-participants.update', async (update) => {
        switch (update.action) {
            case 'add':
                await _welcome(sock, update)
                break
            case 'remove':
                break
        }
    })
}

const _welcome = async (sock, update) => {
    const dbgroup = await db.group.get(update.id)
    if(!dbgroup) return
    if(!dbgroup.welcome) return
    // const group = await sock.groupMetadata(update.id) || (sock.chats[id] || {}).metadata
    for (const participant of update.participants) {
        let avatar = "https://i.pinimg.com/originals/e8/12/c9/e812c98063195ab81dfd288e76be2dd1.jpg";
        const text = `${dbgroup.welcome_message ? dbgroup.welcome_message.replace(/{group\.name}/g, dbgroup.name) : 'Welcome to ' + dbgroup.name}`;
        const heading = participant.replace('@s.whatsapp.net', '');
        let caption = `Selamat datang @${participant.replace('@s.whatsapp.net', '')}`
        try{
            avatar = await sock.profilePictureUrl(participant, 'image');
        } catch {
        } finally {
            try {
                const canvas = createCanvas(1024, 500);
                const ctx = canvas.getContext('2d')
                ctx.font = '42px sans-serif'
                ctx.fontWeight = 'bold'
                ctx.fillStyle = '#ffffff'
                ctx.textAlign = 'center'
            
                // let bg = await loadImage('https://i.ibb.co.com/864Czq0/bsg.png');
                // let bg = await loadImage('https://i.ibb.co.com/kSKxykW/bglz.png');
                // let bg = await loadImage('https://i.ibb.co.com/HrxxcJV/trol.png');
                // let bg = await loadImage('https://i.ibb.co.com/8dStkJr/trol.png');
                let bg = await loadImage(dbgroup.welcome_background || 'https://i.ibb.co/Yh0vzXQ/bg.jpg');
            
                ctx.drawImage(bg, 0, 0, 1024, 500)
                if(heading) {
                    ctx.fillText(heading, 512, 385)
                    ctx.font = '24px sans-serif'
                    ctx.fontWeight = 'semi-bold'
                }
                ctx.fillText(text, 512, 440)
                ctx.beginPath()
                ctx.arc(512, 190, 128, 0, 2 * Math.PI, true)
                ctx.closePath()
                ctx.stroke()
                ctx.fill()
                ctx.clip()
                ctx.drawImage(await loadImage(avatar), 384, 62, 257, 257)
                const buffer = canvas.toBuffer('image/jpeg')
                // const leaveApiUrl = 'https://i.ibb.co.com/HrxxcJV/trol.png'
                sock.sendMessage(update.id, { image : buffer, caption, mentions: [participant] }, { ephemeralExpiration: true })
                // sock.sendMessage(update.id, {
                //     text: '',
                //     contextInfo: {
                //         mentionedJid: [participant],
                //         externalAdReply: {
                //             title: global.botname,
                //             body: "Bye bye",
                //             thumbnailUrl: leaveApiUrl,
                //             sourceUrl: '',
                //             mediaType: 1,
                //             renderLargerThumbnail: true
                //         }
                //     }
                // })
            } catch (error) {
                console.error(error);
            }   
        }
    }
}