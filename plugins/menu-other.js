import axios from 'axios';

const handler = async (m, {conn, usedPrefix}) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;

  try {
    // Download the image from the URL
    const imgUrl = 'https://telegra.ph/file/13240ca790280f569b410.jpg';
    const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
    
    // Prepare the message content
    const taguser = '@' + m.sender.split('@')[0];
    const str =  `-  *hello, ${taguser}*

    _*< Other Commands />*_
    - _/ping_
    - _/math_
    - _/owner_`.trim();
    
    // Create a contact message object
    const fkontak2 = {'key': {'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo'}, 'message': {'contactMessage': {'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}, 'participant': '0@s.whatsapp.net'};
    
    // Extract mentions from the message content
    const mentions = [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net');
    
    // Send the message with the image and other content
    const messageOptions = { image: imgResponse.data, caption: str.trim(), mentions };
    conn.sendMessage(m.chat, messageOptions, { quoted: fkontak2 });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '*[ ℹ️ ] Este menú tiene un error interno, por lo cual no fue posible enviarlo.*', m);
  }
};

handler.command = /^(other)$/i;

export default handler;