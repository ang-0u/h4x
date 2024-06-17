import fs from 'fs';
let handler = async (m, { conn, text } ) => {  
    let chatsall = Object.entries(conn.chats).filter(([_, chat]) => chat.isChats).map(v => v[0]);
    let cc = text ? m : m.quoted ? await m.getQuotedObj() : false || m;
    let teks = text ? text : cc.text;
    
    for (let id of chatsall) { 
        conn.sendButton(id, ` FunDoo\n *instagram.com/_mouad_ad_*\n┃ ⛥│${text}\n┃ ⛥╰───────────\n╰━━━━━━━━━━━──⊷`, 
            'اضغط هنا لمتابعتي في الانستاغرام', 
            fs.readFileSync('./src/avatar_contact.png'), 
            [['المالك', '.owner']], 
            false, 
            { 
                contextInfo: { 
                    externalAdReply: {
                        title: 'إعلان رسمي لجميع الدردشات',
                        body: 'FunDoo', 
                        sourceUrl: `instagram.com/_mouad_ad_`, 
                        thumbnail: fs.readFileSync('./src/Menu2.jpg') 
                    } 
                }
            }
        );
    }

    m.reply(`[❗️INFO❗️] تم إرسال إعلان إلى جميع الدردشات\n\n*ملاحظة: هذا مجرد تجربة فقط*`);
};

handler.help = ['broadcast', 'bc'].map(v => v + ' <النص>');
handler.tags = ['owner'];
handler.command = /^(broadcast|bc)$/i;
handler.rowner = true;

export default handler;