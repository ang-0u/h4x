//by ang_0y vs 12
import tio from 'btch-downloader'
import fetch from 'node-fetch'; 

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Use example ${usedPrefix}${command} https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link`
    let json = await tio.igdl((args[0]))
    let fetchStartTime = new Date();
    let fetchResponse = await fetch(args[0]);
    let fetchEndTime = new Date();
    let fetchTime = fetchEndTime - fetchStartTime;
    for (let i of json) {
        conn.sendFile(m.chat, i.url, 'instagram.mp4', `◦  *Fetching [Ping]* : ${fetchTime} ms`, m)
        await new Promise(resolve => setTimeout(resolve, 1500)); // Delay sending each file by 1500 milliseconds
    }
}
handler.help = ['ig'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(ig(dl)?)$/i
export default handler