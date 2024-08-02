import fg from 'api-dylux';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!args[0]) throw `Example: ${usedPrefix + command} https://vm.tiktok.com/`;
    if (!args[0].match(/tiktok/gi)) throw `The provided link is not a TikTok link.`;

    m.react('⏳'); // Indicate processing with a reaction

    try {
        let res = await fetch(global.API('fgmods', '/api/downloader/tiktok', { url: args[0] }, 'apikey'));
        let data = await res.json();

        if (!data.result.images) {
            let text = `
┌─⊷ *TIKTOK DL* 
▢ *Name:* ${data.result.author.nickname}
▢ *Username:* ${data.result.author.unique_id}
▢ *Duration:* ${data.result.duration}
▢ *Likes:* ${data.result.digg_count}
▢ *Views:* ${data.result.play_count}
▢ *Description:* ${data.result.title}
└───────────
`;
            await conn.sendFile(m.chat, data.result.play, 'tiktok.mp4', text, m);
        } else {
            let caption = `
▢ *Likes:* ${data.result.digg_count}
▢ *Description:* ${data.result.title}
`;
            for (let ttdl of data.result.images) {
                await conn.sendMessage(m.chat, { image: { url: ttdl }, caption: caption }, { quoted: m });
            }
            await conn.sendFile(m.chat, data.result.play, 'tiktok.mp3', '', m, null, { mimetype: 'audio/mp4' });
        }
        m.react('✅'); // Indicate completion with a reaction
    } catch (error) {
        m.reply(`An error occurred.`);
    }
};

handler.help = ['tiktok'];
handler.tags = ['dl'];
handler.command = ['tiktok', 'tt', 'tiktokimg', 'tiktokslide'];
handler.limit = 8;

export default handler;
