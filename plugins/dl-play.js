import yts from 'yt-search';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';

const handler = async (m, { conn, text, args }) => {
  // Check if the user has provided the search text
  if (!text) {
    return m.reply('*Please enter the title of a video along with the type of media you want to receive*\n\nFor example: `!play audio Those Eyes`\n\n> Media types: `audio`, `video`, `mp3doc`, `mp4doc`');
  }

  const parts = text.split(' ');
  const selection = parts.shift().toLowerCase(); // Extract the media type (e.g., audio, video)
  const query = parts.join(' '); // Join the remaining parts to form the search query

  try {
    // Check if the search query is empty
    if (query.length === 0) {
      return m.reply('It seems the video title is missing');
    }
    m.reply("Please wait while I fetch the audio...");

    // Perform a search on YouTube using the query
    const search = await yts(query);
    const videos = search.videos;

    // Check if any videos were found
    if (videos.length === 0) {
      return m.reply('No videos were found for the provided search term.');
    }

    const video = videos[0];
    const url = video.url;
    let mediaUrl;

    // Prepare a message with video details
    const ytMsg = `\`YouTube - ${query}\`\n\nTitle: *${video.title}*\nViews: *${video.views}*\nDuration: *${video.timestamp}*\nLink: ${url}\nDescription: ${video.description}\n\n> Sending ${selection}`;
    await conn.sendMessage(m.chat, { image: { url: video.thumbnail }, caption: ytMsg }, { quoted: m });

    switch (selection) {
      case 'audio': {
        // Download audio version
        const audiodl = await youtubedl(url).catch(async _ => await youtubedlv2(url));
        mediaUrl = await audiodl.audio['128kbps'].download();
        await conn.sendMessage(m.chat, { audio: { url: mediaUrl }, mimetype: 'audio/mpeg' }, { quoted: m });
        break;
      }
      case 'video': {
        // Download video version
        const videodl = await youtubedl(url).catch(async _ => await youtubedlv2(url));
        mediaUrl = await videodl.video['360p'].download();
        await conn.sendMessage(m.chat, { video: { url: mediaUrl }, caption: '`YouTube Video`' }, { quoted: m });
        break;
      }
      case 'mp3doc': {
        // Download audio as a document
        const mp3dl = await youtubedl(url).catch(async _ => await youtubedlv2(url));
        mediaUrl = await mp3dl.audio['128kbps'].download();
        await conn.sendMessage(m.chat, { document: { url: mediaUrl }, mimetype: 'audio/mpeg', fileName: `${query}.mp3` }, { quoted: m });
        break;
      }
      case 'mp4doc': {
        // Download video as a document
        const mp4dl = await youtubedl(url).catch(async _ => await youtubedlv2(url));
        mediaUrl = await mp4dl.video['360p'].download();
        await conn.sendMessage(m.chat, { document: { url: mediaUrl }, mimetype: 'video/mp4', fileName: `${query}.mp4` }, { quoted: m });
        break;
      }
      default:
        return m.reply('Invalid media type. Please use `audio`, `video`, `mp3doc`, or `mp4doc`.');
    }
  } catch (e) {
    m.reply('An error occurred while processing your request. ' + e);
    console.error(e);
  }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(play)$/i;
handler.limit = 8;
export default handler;

