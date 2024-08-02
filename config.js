import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"
import cheerio from "cheerio"
import fetch from "node-fetch"
import axios from "axios"
import moment from "moment-timezone"

// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •

global.owner = [
["212630886351", '𝙊𝙬𝙣𝙚𝙧', true],
["212621851554", '𝙊𝙬𝙣𝙚𝙧 2', true],]

global.mods = ["212630886351"]
global.prems = ["212630886351"]

// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •

global.openai_key = 'sk-0' // Api New: https://platform.openai.com/account/api-keys 
global.openai_org_id = 'org-3' // Api New: https://platform.openai.com/account/org-settings */
global.keysZens = ["LuOlangNgentot", "c2459db922", "37CC845916", "6fb0eff124", "hdiiofficial", "fiktod", "BF39D349845E", "675e34de8a", "0b917b905e6f"]
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]
global.keysxteammm = ["29d4b59a4aa687ca", "5LTV57azwaid7dXfz5fzJu", "cb15ed422c71a2fb", "5bd33b276d41d6b4", "HIRO", "kurrxd09", "ebb6251cc00f9c63"]
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]
global.keysneoxrrr = ["5VC9rvNx", "cfALv5"]
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]
global.lolkeysapi = "GataDios"
global.itsrose = ["4b146102c4d500809da9d1ff"]
global.baileys = "@whiskeysockets/baileys"

global.APIs = { 
xteam: 'https://api.xteam.xyz',
dzx: 'https://api.dhamzxploit.my.id',
lol: 'https://api.lolhuman.xyz',
violetics: 'https://violetics.pw',
neoxr: 'https://api.neoxr.my.id',
zenzapis: 'https://api.zahwazein.xyz',
akuari: 'https://api.akuari.my.id',
akuari2: 'https://apimu.my.id',	
fgmods: 'https://api.fgmods.xyz', 
botcahx: 'https://api.botcahx.biz.id',
ibeng: 'https://api.ibeng.tech/docs',	
rose: 'https://api.itsrose.site',
popcat : 'https://api.popcat.xyz',
xcoders : 'https://api-xcoders.site'
},

//-----------------------------------------------
    
global.APIKeys = { 
'https://api.xteam.xyz': `${keysxteam}`,
'https://api.lolhuman.xyz': `${lolkeysapi}`,
'https://api.neoxr.my.id': `${keysneoxr}`,	
'https://violetics.pw': 'beta',
'https://api.zahwazein.xyz': `${keysxxx}`,
'https://api.fgmods.xyz': 'sqFU3rkB', 
'https://api-fgmods.ddns.net': 'fg-dylux',
'https://api.botcahx.biz.id': 'Admin',
'https://api.ibeng.tech/docs': 'tamvan',
'https://api.itsrose.site': 'Rs-Zeltoria',
'https://api-xcoders.site': 'Frieren'
}
// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment

// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •

global.official = [ 
["212630886351", 'tt', 1],]


global.packname = ""
global.author = ""

// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •


global.thumbnailUrl = ['https://telegra.ph/file/c8590ced42d379d07010b.jpg', 'https://telegra.ph/file/fa43948aff3d97e5fa802.jpg', 'https://telegra.ph/file/4cf068b11d783b0e32609.jpg', 'https://telegra.ph/file/2ac97194e07c87d796ad9.jpg']

// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •

global.multiplier = 200
global.maxwarn = 3


// • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
unwatchFile(file);
console.log(chalk.redBright("Update 'config.js'"));
import(`${file}?update=${Date.now()}`);
})
