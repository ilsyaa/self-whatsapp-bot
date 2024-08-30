const config = require("../../config.js");
const log = require("../utils/log.js")
const { default:makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
} = require("@whiskeysockets/baileys")
const pino = require("pino")
const path = require("path");

const startSocket = async () => {
    let retryCount = 0;
    const { state, saveCreds } = await useMultiFileAuthState(path.join(config.STORAGE_SESSION, config.SESSION_NAME));
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: pino({ level: "silent" }),
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        browser: ['VelixS', 'Safari', '3.0']
    });

    require('./event')(sock)

    try{
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update
            if (connection == "connecting") {
                log.debug(`SESSION : Conecting.`)
            }
            if (connection === "close") {
                const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode

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
                retryCount = 0
            }
        })
        sock.ev.on("creds.update", async () => {
            await saveCreds();
        })
    }catch(e){
        log.error("SOCKET : "+e)
    }
}

startSocket()