module.exports = {
    SESSION_NAME : "cihuy",
    STORAGE_PATH : __dirname + "/storage",
    STORAGE_SESSION : __dirname + "/storage/session",
    STORAGE_DB : __dirname + "/storage/databases",

    ...require("./schema.js")
}