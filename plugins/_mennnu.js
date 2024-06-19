import fs from 'fs/promises';
import axios from 'axios';

const handler = async (m, { conn, usedPrefix }) => {
  if (usedPrefix.toLowerCase() === 'a') return;

  try {
    const gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXZtdjJzaDAzOXFoaTlkejZydHBhdnl3MHZiZWIzODBqbDM3M24ycCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ErZ8hv5eO92JW/giphy.gif';
    const response = await axios.get(gifUrl, { responseType: 'arraybuffer' });
    const gifBuffer = Buffer.from(response.data, 'binary');

    const taguser = '@' + m.sender.split('@')[0];

    const str = `▢ *hello, ${taguser}*

    _*< Other Commands />*_
    ▢ _/ping_
    ▢ _/math_
    ▢ _/owner_`.trim();

    const fkontak2 = {
      key: {
        participants: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: 'Halo'
      },
      message: {
        contactMessage: {
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    };

    const mentions = [...str.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
    const messageOptions = { video: gifBuffer, caption: str, gifPlayback: true, mentions };

    await conn.sendMessage(m.chat, messageOptions, { quoted: fkontak2 });
  } catch (error) {
    console.error('Error sending menu:', error);
    await conn.reply(m.chat, '*[ ℹ️ ] Este menú tiene un error interno, por lo cual no fue posible enviarlo.*', m);
  }
};

handler.command = /^(other)$/i;

export default handler;