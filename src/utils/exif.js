const { Image } = require('node-webpmux');
const sharp = require("sharp");
const config = require("../../config.js");

const stickerImage = async (imageBuffer, meta) => {
    try {
        const processedImage = await sharp(imageBuffer)
            .resize({ width: 512, height: 512 })
            .webp({ quality: 10 })
            .toBuffer();

        const img = new Image();
        const json = {
            "sticker-pack-id": `https://github.com/XinnChan`,
            "sticker-pack-name": meta?.pack || config.STICKER_PACK,
            "sticker-pack-publisher": meta?.author || config.STICKER_AUTHOR,
        };

        const exifAttr = Buffer.from([
            0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
            0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
        ]);

        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
        const exif = Buffer.concat([exifAttr, jsonBuff]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);
        await img.load(processedImage);
        img.exif = exif;
        return await img.save(null);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    stickerImage
}