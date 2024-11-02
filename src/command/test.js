const { createCanvas, loadImage } = require('canvas');
const { jidDecode, downloadContentFromMessage, downloadMediaMessage, generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const db = require('../utils/db');
const { default: axios } = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { quax } = require('../utils/uploader.js')

module.exports = {
    name: "test",
    description: "-",
    withoutPrefix: true,
    cmd: ['test'],
    run: async ({ m, sock }) => {
        if (!m.senderIsOwner) return;

        return;
        async function sendList(jid, title, text, buttonText, listSections, quoted, options = {}) {
            let img;

            const sections = [...listSections]

            const message = {
                interactiveMessage: {
                    header: {
                        title: title,
                        hasMediaAttachment: false,
                        imageMessage: null,
                        videoMessage: null
                    },
                    body: { text },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: buttonText,
                                    sections
                                })
                            }
                        ],
                        messageParamsJson: ''
                    }
                }
            };

            let msgL = generateWAMessageFromContent(jid, {
                viewOnceMessage: {
                    message
                }
            }, { userJid: sock.user.jid, quoted })

            return sock.relayMessage(jid, msgL.message, { messageId: msgL.key.id, ...options })
        }

        let listSections = [];
        listSections.push({
            title: `✎ LABEL GROUP`, highlight_label: `Popular`,
            rows: [
                {
                    header: "𓆩࿔ྀુ⃟🌹⃟𝘼𝙐𝙏𝙊 𝙑𝙀𝙍𝙄𝙁𝙄𝘾𝘼𝙍 ╎✅",
                    title: "",
                    description: `🗃 Verificacion Automáticamente`,
                    id: `#reg`,
                },
                {
                    header: "𓆩࿔ྀુ⃟🌹⃟𝙈𝙀𝙉𝙐 𝘾𝙊𝙈𝙋𝙇𝙀𝙏𝙊 ╎ 🍿ꪳ͢",
                    title: "",
                    description: `🐢 Muestra el menú completo.`,
                    id: `#allmenu`,
                },
                {
                    header: "𓆩࿔ྀુ⃟🌹⃟𝙈𝙀𝙉𝙐 𝙉𝙎𝙁𝙒 ╎🔞",
                    title: "",
                    description: `🔥 Muestra el menú +18.`,
                    id: `#hornymenu`,
                },
                {
                    header: "𓆩࿔ྀુ⃟🌹⃟𝙂𝙄𝙏𝙃𝙐𝘽 ╎ ⭐️",
                    title: "",
                    description: `🍟 Muestra el github de la bot.`,
                    id: `#sc`,
                },
                {
                    header: "𓆩࿔ྀુ⃟🌹⃟𝙎𝙆𝙔 𝙐𝙇𝙏𝙍𝘼 𝙋𝙇𝙐𝙎 ╎ 💸",
                    title: "",
                    description: `⚡️ Super hosting, Sky Ultra Plus.`,
                    id: `#skyplus`,
                },
                {
                    header: "𓆩࿔ྀુ⃟🌹⃟𝙎𝙋𝙀𝙀𝘿 ╎ 🌸",
                    title: "",
                    description: `🚀 Muestra su velocidad y mas.`,
                    id: `#speed`,
                },
                {
                    header: "𓆩࿔ྀુ⃟🌹⃟𝙎𝙀𝙍𝘽𝙊𝙏 𝘾𝙊𝘿𝙀  ╎ ⚡️",
                    title: "",
                    description: `🍟 Ser subbot mediante un codigo de 8 digitos.`,
                    id: `#code`,
                },
                {
                    header: "𓆩࿔ྀુ⃟🌹⃟𝙎𝙀𝙍𝘽𝙊𝙏 𝙌𝙍 ╎ 📂",
                    title: "",
                    description: `☁️ Ser subbot mediante un codigo QR.`,
                    id: `#serbot`,
                },
                {
                    header: "𓆩࿔ྀુ⃟🌹⃟𝙎𝙐𝘽𝘽𝙊𝙏𝙎 ╎ 🚩",
                    title: "",
                    description: `🟢 Muestra su subbots onlines.`,
                    id: `#bots`,
                },
                {
                    header: "𓆩࿔ྀુ⃟🌹⃟𝙂𝙍𝙐𝙋𝙊𝙎 ☁️",
                    title: "",
                    description: `📲 Muestra los grupos principales de la bot.`,
                    id: `/help`,
                },
            ],
        });

        await sendList(
            m.chat,
            'Nakiri Whatsapp BOT',
            'Selamat Datang Di Nakiri Whatsapp BOT',
            'MENU',
            listSections,
            m
        )
    }
}

