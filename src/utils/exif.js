const { Image } = require('node-webpmux');
const sharp = require("sharp");
const config = require("../../config.js");

const packID = 'com.snowcorp.stickerly.android.stickercontentprovider b5e7275f-f1de-4137-961f-57becfad34f2'
const playstore = 'https://play.google.com/store/apps/details?id=com.marsvard.stickermakerforwhatsapp'
const itunes = 'https://itunes.apple.com/app/sticker-maker-studio/id1443326857'

const stickerImage = async (imageBuffer, meta) => {
    try {
        const processedImage = await sharp(imageBuffer)
            .resize({ width: 512, height: 512 })
            .webp({ quality: 10 })
            .toBuffer();

        const img = new Image();
        const json = {
            'sticker-pack-id': packID,
            'sticker-pack-name': meta?.pack || config.STICKER_PACK,
            'sticker-pack-publisher': meta?.author || config.STICKER_AUTHOR,
            'android-app-store-link': playstore,
			'ios-app-store-link': itunes
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