const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange,
		waChatKey,
		mentionedJid,
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { color } = require('./lib/color')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))

require('./index.js')
nocache('./index.js', module => console.log(`${module} is now updated!`))

const starts = async (hexa = new WAConnection()) => {
    hexa.logger.level = 'warn'
    console.log(banner.string)
    hexa.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan bang'))
    })

    fs.existsSync('./session.json') && hexa.loadAuthInfo('./session.json')
    hexa.on('connecting', () => {
        start('2', 'Connecting...')
    })
    hexa.on('open', () => {
        success('2', 'Connected')
    })
    await hexa.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./session.json', JSON.stringify(hexa.base64EncodedAuthInfo(), null, '\t'))

    hexa.on('credentials-updated', () => {
     const authInfo = hexa.base64EncodedAuthInfo()
     console.log(`credentials updated!`)
     fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
    })

    fs.existsSync('./session.json') && hexa.loadAuthInfo('./session.json')

	hexa.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await hexa.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await hexa.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i.ibb.co/rvsVF3r/5012fbb87660.png'
				}
				ini_user = hexa.contacts[num]
				teks = `*YO🤚* @${num.split('@')[0]}\n*welcome to group* *${mdata.subject}*\n___________________________\n  │Intro yah 🔪😋 \n  ├─ ❏  Nama : \n  ├─ ❏  Umur : \n  ├─ ❏  Askot : \n  ├─ ❏  Gender : \n  │ 𝐒𝐚𝐯𝐞 𝐍𝐨𝐦𝐨𝐫 𝐀𝐃𝐌𝐈𝐍! \n *___________________________*\n_baca desc dulu kalo gk suka out aja🚮_`
let	buff = await getBuffer(ppimg)
				hexa.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await hexa.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i.ibb.co/rvsVF3r/5012fbb87660.png'
				}
				teks = `Alfatihah buat @${num.split('@')[0]} yang sudah meninggalkan kita🤲`
				let buff = await getBuffer(ppimg)
				hexa.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
		}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
})

    hexa.on('chat-update', async (message) => {
        require('./index.js')(hexa, message)
    })
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
