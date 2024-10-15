module.exports = {
    name: "info-owner",
    description: "Show Contact Owner",
    cmd: ['owner'],
    menu: {
        label: 'info'
    },
    run: async ({ m, sock }) => {
        const [ number, name ] = Object.entries(m.db.bot.owners)[0]
        const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n'
            + `FN:${name}\n` // full name
            + `ORG:${name};\n` // the organization of the contact
            + `TEL;type=CELL;type=VOICE;waid=${number}:+${number}\n` // WhatsApp ID + phone number
            + 'END:VCARD'
        await sock.sendMessage(
            m.chat,
            {
                contacts: {
                    displayName: `${name}`,
                    contacts: [{ vcard }]
                }
            }
        )

    }
}