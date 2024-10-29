const exp = require('../../utils/exp.js');

module.exports = {
    name: "fun-tebak-angka",
    description: "Tebak Angka",
    cmd: ['angka', 'number', 'tebakangka'],
    menu: {
        label: 'fun',
        example: '<1-10>'
    },
    run: async ({ m, sock }) => {
        const number = m.body.arg.replace(/[^0-9]/g, '');
        if(!number) return m._reply(m.lang(msg).ex);
        let random = Math.floor(Math.random() * 10) + 1;
        if(number < 1 || number > 10) return m._reply(m.lang(msg).minamx);

        let text = `\`${m.lang(msg).title}\`\n\n`
        text += `> Angka Kamu : ${number}\n`
        text += `> Angka Bot  : ${random}\n\n`
        text += `_${m.lang(msg).answ}_`
        exp.add(m.sender, exp.random(1, 5));
        m._reply(text)
    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}angka `1-10`',
        minmax: 'Angka harus di antara `1-10`',
        title: 'Tebak Angka',
        answ: 'Apakah Angkamu Dengan Bot Sama?',
    },
    en: {
        ex: 'usage: {prefix}number `1-10`',
        minamx: 'Number must be between `1-10`',
        title: 'Guess Number',
        answ: 'Is your number with the bot same?',
    }
}