const { FormData, Blob } = require('formdata-node');
const { fromBuffer } = require('file-type');
const axios = require('axios');

const quax = async (buffer) => {
    const { ext, mime } = await fromBuffer(buffer)
    const form = new FormData()
    const blob = new Blob([buffer], { type: mime })
    form.append('files[]', blob, 'tmp.' + ext)
    const { data } = await axios.post("https://qu.ax/upload.php", form, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return data.files[0].url;
}

module.exports = {
    quax
}