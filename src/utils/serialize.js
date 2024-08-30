const { 
    proto, 
    downloadContentFromMessage,
    getContentType,
    extractMessageContent,
    jidNormalizedUser
} = require('@whiskeysockets/baileys');
const config = require('../../config.js');
const { Boom } = require('@hapi/boom');
const path = require('path');
const { writeFile } = require('fs/promises');
const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'];
let M = proto.WebMessageInfo;

const serialize = (conn, m) => {
    if (!m) return m;
    if (m.key) {
        m.id = m.key.id;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.botNumber = jidNormalizedUser(conn.user?.id)
        // m.sender = m.fromMe ? conn.user.id : m.participant ? m.participant : m.key.participant ? m.key.participant : m.chat;
        m.sender = jidNormalizedUser(m.fromMe ? conn.user.id : m.participant ? m.participant : m.key.participant ? m.key.participant : m.chat)
    }
    if (m.message) {
        m.message = extractMessageContent(m.message)
        m.mtype = getContentType(m.message);
        m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype]);
        m.ephemeral = m.msg?.contextInfo?.expiration || false
        m.text = m.message?.conversation || m.message?.[m.mtype]?.text || m.message?.[m.mtype]?.caption || m.message?.[m.mtype]?.contentText || m.message?.[m.mtype]?.selectedDisplayText || m.message?.[m.mtype]?.title || ""
        m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];

        m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null;
        if (m.quoted) {
            m.quoted = extractQuotedMessage(conn, m);
        }
    }

    m.senderIsOwner = config.OWNER_NUMBER.includes(m.sender.split('@')[0]);
    
    m.body = {
        full : m.text.trim(),
        first : m.text.split(' ')[0].trim(),
        arg : m.text.slice(m.text.split(' ')[0].length).trim(),
    }
    
    m.download = () => downloadMedia(m);
    m.saveMedia = (filePath) => saveMedia(m, filePath);
    
    m.copy = () => serialize(conn, M.fromObject(M.toObject(m)));
    m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => conn.copyNForward(jid, m, forceForward, options);

    m = messageWrapper(conn, m);
    return m;
}

const messageWrapper = (conn, m) => {
    m._reply = (text) => {
        return conn.sendMessage(m.chat, typeof text === 'string' ? { text: text } : text, { quoted: m, ephemeralExpiration: m.ephemeral })
    }

    m._sendMessage = (jid, content, options) => {
        if (m.ephemeral) options = { ...options, ...{ ephemeralExpiration: m.ephemeral } };
        return conn.sendMessage(jid, content, options)
    }
    return m;
}

const extractQuotedMessage = (conn, m) => {
    if (m.quoted?.ephemeralMessage) m.quoted = m.quoted.ephemeralMessage.message;
    if (m.quoted?.viewOnceMessageV2Extension) m.quoted = m.quoted.viewOnceMessageV2Extension.message;
    if (m.quoted?.viewOnceMessageV2) m.quoted = m.quoted.viewOnceMessageV2.message;
    if (m.quoted?.documentWithCaptionMessage) m.quoted = m.quoted.documentWithCaptionMessage.message;
    
    let type = getContentType(m.quoted);
    

    m.quoted = m.quoted[type];
    if (['productMessage'].includes(type)) {
        type = getContentType(m.quoted);
        m.quoted = m.quoted[type];
    }
    if (typeof m.quoted === 'string') m.quoted = { text: m.quoted };
    m.quoted.mtype = type;
    m.quoted.id = m.msg.contextInfo.stanzaId;
    m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
    m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false;
    m.quoted.sender = jidNormalizedUser(m.msg.contextInfo.participant);
    m.quoted.fromMe = m.quoted.sender === (conn.user && conn.user.id);
    m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || '';
    m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
    m.quoted.ephemeral = m.quoted?.contextInfo?.expiration || false;
    m.quoted.download = () => downloadMedia(m, true);
    m.quoted.saveMedia = (filePath) => saveMedia(m, filePath, true);
    // let vM = m.quoted.fakeObj = M.fromObject({
    //     key: {
    //         remoteJid: m.quoted.chat,
    //         fromMe: m.quoted.fromMe,
    //         id: m.quoted.id
    //     },
    //     message: quoted,
    //     ...(m.isGroup ? { participant: m.quoted.sender } : {})
    // })
    // m.quoted.delete = () => conn.sendMessage(m.quoted.chat, { delete: vM.key })

    return m.quoted;
};

// Helper function to download media

const downloadMedia = async (m, quoted = false) => {
    let messageType = mediaTypes.find(v => (quoted ? m.quoted.mtype : m.mtype) == v);
    
    if (!messageType) {
        throw new Error('No media found in the message');
    }
    
    const mediaKey = quoted ? m.quoted.mediaKey : m.message[messageType].mediaKey;
    if (!mediaKey) {
        throw new Error('Media key is missing');
    }

    try {
        const stream = await downloadContentFromMessage(quoted ? m.quoted : m.message[messageType], messageType.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return {
            buffer,
            mtype: quoted ? m.quoted.mtype : m.mtype,
            mediaType: messageType
        };
    } catch (error) {
        if (error instanceof Boom && error.output.statusCode === 404) {
            throw new Error('Media not found. It might have been deleted or it\'s not accessible.');
        }
        throw error;
    }
}

const saveMedia = async (m, customPath = '', quoted = false) => {
    try {
        const buffer = await downloadMedia(m, quoted);
        const mtype = quoted ? m.quoted.mtype : m.mtype;
        const mediaTypes = {
            'imageMessage': '.jpg',
            'videoMessage': '.mp4',
            'audioMessage': '.mp3',
            'stickerMessage': '.webp',
            'documentMessage': ''  // We'll use the original file extension for documents
        };
        
        let fileName = `${Date.now()}`;
        let fileExt = mediaTypes[mtype] || '';
        
        if (mtype === 'documentMessage') {
            let documentName = quoted ? m.quoted?.fileName : m.message.documentMessage.fileName;
            const originalExt = path.extname(documentName);
            fileExt = originalExt || '.bin';  // Use .bin if no extension is found
            fileName = path.basename(documentName || fileName, originalExt);
        }
        
        const filePath = path.join(customPath || 'media', `${fileName}${fileExt}`);
        
        await writeFile(filePath, buffer);
        return filePath;
    } catch (error) {
        throw error;
    }
}

// Async function to get group admins and update isAdmin
const updateAdminStatus = async (conn, m) => {
    if (m.isGroup) {
        const groupMetadata = await conn.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        m.isGroup = {
            groupMetadata: groupMetadata,
            botIsAdmin: participants.some(p => p.id === m.botNumber && (p.admin === 'admin' || p.admin === 'superadmin')),
            senderIsSuperAdmin: participants.some(p => p.id === m.sender && p.admin === 'superadmin'),
            senderIsAdmin: participants.some(p => p.id === m.sender && (p.admin === 'admin' || p.admin === 'superadmin'))
        }
    }
}

const isMedia = (type) => {
    return mediaTypes.includes(type)
}

module.exports = { serialize, updateAdminStatus, isMedia, saveMedia };