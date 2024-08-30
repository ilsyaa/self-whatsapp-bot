const config = require("../../../config.js")

module.exports = {
    name: "info-owner",
    description: "Show Contact Owner",
    cmd: ['owner'],
    menu: {
        label: 'info'
    },
    run: async ({ m, sock }) => {
        // send a contact!
        const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n'
            + `FN:${config.OWNER_NAME[0]}\n` // full name
            + `ORG:${config.OWNER_NAME[0]};\n` // the organization of the contact
            + `TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER[0]}:+${config.OWNER_NUMBER[0]}\n` // WhatsApp ID + phone number
            + 'END:VCARD'
        await sock.sendMessage(
            m.chat,
            {
                contacts: {
                    displayName: `${config.OWNER_NAME[0]}`,
                    contacts: [{ vcard }]
                }
            }
        )

    }
}