import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!args[0]) throw 'Ex: ' + usedPrefix + command + ' url';
  let res = await api(args[0]);
  if (res.status) {
    let result = res.result[0];
    let thumbnail = result.thumbnail;
    let url = result.url;
    await conn.sendFile(m.chat, url, 'instagram.jpg', 'Here is your download', m, false, { thumbnail });
  } else {
    throw 'Failed to fetch data from the API';
  }
};

handler.command = /^(ig)$/i;
export default handler;

async function api(url) {
  let apiUrl = `https://api.fgmods.xyz/api/downloader/igdl?url=${url}&apikey=lPPa6XqV`;
  let response = await fetch(apiUrl);
  if (!response.ok) throw 'Error fetching data from API';
  let data = await response.json();
  return data;
}
