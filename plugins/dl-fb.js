import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!args[0]) throw 'Ex: ' + usedPrefix + command + ' url';
  let { videoUrl, quality } = await api(args[0]);
  if (videoUrl) {
    conn.sendFile(m.chat, videoUrl, 'video.mp4', `*Quality : (${quality})*`, m);
  } else {
    throw 'Failed to fetch video URL';
  }
};

handler.command = /^(fb)$/i;
handler.register = true;
handler.limit = 10;
export default handler;

async function api(url) {
  try {
    let apiKey = 'sqFU3rkB'; // your API key
    let apiUrl = `https://api.fgmods.xyz/api/downloader/fbdl?url=${encodeURIComponent(url)}&apikey=${apiKey}`;
    let response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch');
    let json = await response.json();
    if (json.status && json.result) {
      if (json.result.HD) {
        return { videoUrl: json.result.HD, quality: 'HD' };
      } else if (json.result.Normal_video) {
        return { videoUrl: json.result.Normal_video, quality: 'Normal_video' };
      }
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error(error);
    return { videoUrl: null, quality: null };
  }
}
