import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';
import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';

let handler = async (m, { text, conn, args, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, `Please provide a YouTube link or video number.\n*Example : ${usedPrefix + command} https://youtu.be/*`, null, m);

    let youtubeLink = '';
    if (args[0].includes('youtu')) {
        youtubeLink = args[0];
    } else {
        const index = parseInt(args[0]) - 1;
        if (index >= 0) {
            if (Array.isArray(global.videoList) && global.videoList.length > 0) {
                const matchingItem = global.videoList.find(item => item.from === m.sender);
                if (matchingItem) {
                    if (index < matchingItem.urls.length) {
                        youtubeLink = matchingItem.urls[index];
                    } else {
                        throw `Invalid video index. Total videos: ${matchingItem.urls.length}`;
                    }
                } else {
                    throw `No playlist found. Use ${usedPrefix}playlist <text>`;
                }
            } else {
                throw `No playlist found. Use ${usedPrefix}playlist <text>`;
            }
        }
    }

    await conn.reply(m.chat, 'Preparing audio download...', null, m);

    try {
        const quality = '128kbps';
        const yt = await youtubedl(youtubeLink).catch(async _ => await youtubedlv2(youtubeLink));
        const dl_url = await yt.audio[quality].download();
        const title = await yt.title;
        await conn.sendFile(m.chat, dl_url, title + '.mp3', null, m, false, { mimetype: 'audio/mp3' });
    } catch {
        try {
            const response = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=${lolkeysapi}&url=${youtubeLink}`);
            const json = await response.json();
            const title = json.result.title || 'error';
            await conn.sendFile(m.chat, json.result.link, title + '.mp3', null, m);
        } catch {
            try {
                const searchResults = await yts(youtubeLink);
                const videos = searchResults.all.filter(v => v.type === 'video');
                const info = await ytdl.getInfo('https://youtu.be/' + videos[0].videoId);
                const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
                await conn.sendFile(m.chat, format.url, videos[0].title + '.mp3', null, m);
            } catch (e) {
                console.error(`Error in ${command}:`, e);
                await conn.reply(m.chat, `An error occurred. Please try again.\n#report`, null, m);
            }
        }
    }
};

handler.command = /^audio|fgmp3|dlmp3|getaud|yt(a|mp3)$/i;
handler.limit = 5;
export default handler;