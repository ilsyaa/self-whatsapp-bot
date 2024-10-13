const path = require('path')

module.exports = {
    SESSION_NAME : "cihuy",

    STORAGE_PATH : __dirname + "/storage",
    STORAGE_SESSION : __dirname + "/storage/session",
    STORAGE_DB : __dirname + "/storage/databases",

    OWNER_NUMBER : ["6285174902345"],
    OWNER_NAME : ["Ilsya"],

    STICKER_PACK: "Whatsapp Bot 6285731618404",
    STICKER_AUTHOR: "Ilsya",

    USER_DEFAULT: {
        plan: "free", // free or pro
        plan_expire: false, // false = unlimited
        limit: 10, // false -> unlimited
        exp: 0,
    },

    prefix: ['/', '.', '!'],
}