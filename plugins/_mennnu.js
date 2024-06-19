import fetch from 'node-fetch';
import PhoneNumber from 'awesome-phonenumber';

const handler = async (m, { conn, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  
  try {
    // Date and Locale related variables
    const d = new Date();
    const locale = 'es-ES';
    const week = d.toLocaleDateString(locale, { weekday: 'long' });
    const date = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    // Uptime calculation
    const _uptime = process.uptime() * 1000;
    const uptime = clockString(_uptime);
    
    // User related variables
    const user = global.db.data.users[m.sender];
    const { money, joincount } = user;
    const { exp, limit, level, role } = user;
    const rtotalreg = Object.values(global.db.data.users).filter((user) => user.registered === true).length;
    const rtotal = Object.entries(global.db.data.users).length || '0';
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(4001);
    const taguser = '@' + m.sender.split('@s.whatsapp.net')[0];
    
    // Document type randomizer
    const doc = ['pdf', 'zip', 'vnd.openxmlformats-officedocument.presentationml.presentation', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const document = doc[Math.floor(Math.random() * doc.length)];
    
    // React to the message
    m.react('💸');

    // Image URL
    const pictureUrl = 'https://telegra.ph/file/0e7613522742726b2ca8d.jpg';
    
    const str = `▢ _*hello, ${taguser}*_

    _*< info user />*_

    ▢ _*Date : ${date}*_
    ▢ _*Exp : ${exp}*_
    ▢ _*Limit: ${limit}*_

    _*< list Commands />*_

    ▢ _/make-account_
    ▢ _/ai_
    ▢ _/play_
    ▢ _/yts_
    ▢ _/ytmp4_
    ▢ _/ytmp3_
    ▢ _/ig_
    ▢ _/fb_
    ▢ _/tiktok_
    ▢ _/manga_
    ▢ _/img_
    ▢ _/apk_`.trim();
    
    const fkontak2 = {
      'key': { 'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo' },
      'message': {
        'contactMessage': {
          'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
        }
      },
      'participant': '0@s.whatsapp.net'
    };
    
    const mentions = [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net');
    
    await conn.sendMessage(m.chat, { image: { url: pictureUrl }, caption: str.trim(), mentions }, { quoted: fkontak2 });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '*[ ℹ️ ] Este menu tiene un error interno, por lo cual no fue posible enviarlo.*', m);
  }
};

// Utility function to format uptime
const clockString = (ms) => {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
};

handler.command = /^(menu|help)$/i;

export default handler;