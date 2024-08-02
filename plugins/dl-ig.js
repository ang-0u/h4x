import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `*${usedPrefix + command}* https://www.instagram.com/`;
    
    m.react('⏳'); // Indicate processing with a reaction

    try {
        let res = await fetch(global.API('fgmods', '/api/downloader/igdl', { url: args[0] }, 'apikey'));
        if (!res.ok) throw `An error occurred while fetching the data.`;
        
        let data = await res.json();

        for (let item of data.result) {
            await conn.sendFile(m.chat, item.url, 'igdl.jpg', `✅ Successfully downloaded.`, m);
        }

        m.react('✅'); // Indicate completion with a reaction
    } catch (error) {
        m.reply(`An error occurred.`);
    }
};

handler.help = ['instagram <link ig>'];
handler.tags = ['dl'];
handler.command = ['ig', 'igdl', 'instagram', 'igimg', 'igvid'];
handler.diamond = true;

export default handler;
