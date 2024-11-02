const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const Crypto = require('crypto')
const { UltimateTextToImage } = require('ultimate-text-to-image')
const path = require('path')
const config = require('../../config.js')

async function attp(text) {
    let nome = randomName()
    let cores = [
        '#ff0000',
        '#ffa600',
        '#ffee00',
        '#2bff00',
        '#00ffea',
        '#3700ff',
        '#ff00ea',
    ]

    const lista = cores.map((cor, index) => {
        return ttp(text, cor, nome + index + '.png')
    })

    return new Promise(function (resolve, reject) {
        // gerar webp
        ffmpeg()
            .addInput((nome + '%d.png'))
            .addOutputOptions([
                '-vcodec', 'libwebp', '-vf',
                'scale=500:500:force_original_aspect_ratio=decrease,setsar=1, pad=500:500:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse',
                '-loop', '0', '-preset', 'default'
            ])
            //.outputFPS(15)
            .toFormat('webp')
            .on('end', () => {
                for (let img of lista) {
                    delFile(img)
                }
                resolve(nome + '.webp')
            })
            .on('error', (err) => {
                for (let img of lista) {
                    delFile(img)
                }
                reject(('erro ffmpeg ' + err))
            })
            .save((nome + '.webp'))
    })
}

function ttp(text, color = '#ffffff', name = randomName('.png')) {
    new UltimateTextToImage(text, {
        width: 500,
        height: 500,
        fontColor: color,
        fontFamily: "Sans-Serif",
        fontSize: 600,
        minFontSize: 10,
        lineHeight: 0,
        autoWrapLineHeightMultiplier: 1.2,
        margin: 0,
        // marginBottom: 40,
        align: "center",
        valign: "middle",
    })
        .render()
        .toFile(name);

    return name
}

function randomName(ext = '') {
    return path.join(config.STORAGE_PATH+'/temp', `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}${ext}`)
}

function delFile(file) {
    try {
        fs.unlinkSync(file)
    } catch (error) {

    }
}

module.exports = {
    attp,
    ttp
}