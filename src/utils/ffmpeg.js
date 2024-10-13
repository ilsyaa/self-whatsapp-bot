const fs = require('fs')
const Crypto = require("crypto")
const ff = require('fluent-ffmpeg')
const path = require("path")
const config = require("../../config");

function tmpdir() {
    return config.STORAGE_PATH+'/temp'
}

// return buffer
async function webpToVideo(media) {
    const tmpFileIn = media;
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`);

    await new Promise((resolve, reject) => {
        ff(tmpFileIn)
            .on('error', reject)
            .on('end', () => resolve(true))
            .addOutputOptions([
                '-vf',
                'scale=320:320', // menyesuaikan ukuran, bisa diubah sesuai kebutuhan
                '-r',
                '15', // fps, bisa diubah sesuai kebutuhan
            ])
            .toFormat('mp4')
            .save(tmpFileOut);
    });

    const buff = fs.readFileSync(tmpFileOut);
    fs.unlinkSync(tmpFileOut);
    fs.unlinkSync(tmpFileIn);

    return buff;
}

module.exports = { webpToVideo }