const config = require("../../config.js");
const log = require("../utils/log.js")
const { default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    PHONENUMBER_MCC
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const path = require("path");

const startSocket = async () => {
    let retryCount = 0;
    const msgRetryCounterCache = new NodeCache()
    const { state, saveCreds } = await useMultiFileAuthState(path.join(config.STORAGE_SESSION, config.SESSION_NAME));
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino().child({ 
                level: 'silent', 
                stream: 'store' 
            })),
        },
        logger: pino({ level: "silent" }),
        browser: ['VelixS', 'Safari', '3.0'],
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                message.buttonsMessage 
                || message.templateMessage
                || message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
        }, 
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    });

    require('./event')(sock)

    try {
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update
            if (connection == "connecting") {
                log.debug(`SESSION : Conecting.`)
            }
            if (connection === "close") {
                const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
                sock.connected = false
                let retryAttempt = retryCount;
                let shouldRetry;
                if (code != DisconnectReason.loggedOut && retryAttempt < 20) {
                    shouldRetry = true;
                }
                if (shouldRetry) {
                    retryAttempt++;
                }
                if (shouldRetry) {
                    retryCount = retryAttempt
                    startSocket();
                } else {
                    log.error(`SESSION : Disconnected.`)
                    retryCount = 0
                    sock?.logout()
                }
            }
            if (connection == "open") {
                log.info(`SESSION : Connected.`)
                sock.connected = true
                retryCount = 0
            }
        })
        sock.ev.on("creds.update", async () => {
            await saveCreds();
        })
    } catch (e) {
        log.error("SOCKET : " + e)
    }
}

startSocket()