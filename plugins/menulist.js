import jimp from 'jimp';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;

let handler = async (m, { conn, usedPrefix, __dirname, text, isPrems }) => {
    if (usedPrefix == 'a' || usedPrefix == 'A') return;
    try {
        let senderTag = m.pushName || conn.getName(m.sender);
        let imageBuffer = await genProfile(); // Generate image without passing conn or m
        m.react('🔥');

        const buttonParamsJson = JSON.stringify({
            title: "Show options",
            description: "Get information through official means about zall",
            sections: [
                {
                    title: "Fundoo more ", highlight_label: "Popular",
                    rows: [
                        { header: "Account Commands", title: "", description: "all account commands", id: usedPrefix + "accmenu" }
                    ]
                },
                {
                    title: "Fundoo downloads", highlight_label: "Popular",
                    rows: [
                        { header: "Download Commands", title: "", description: "All download commands", id: usedPrefix + "downmenu" }
                    ]
                },
                {
                    title: "Fundoo Ai ", highlight_label: "Popular",
                    rows: [
                        { header: "Ai Commands", title: "", description: "all ai commands", id: usedPrefix + "aimenu" }                        
                    ]
                },
                {
                    title: "Fundoo Other ", highlight_label: "Popular",
                    rows: [
                        { header: "Other Commands", title: "", description: "all Other commands", id: usedPrefix + "menuother" },
                        { header: "info", title: "", description: "Info user", id: usedPrefix + "info" }
                    ]
                },
                {
                    title: "Ⓜ️ Menu", highlight_label: "Popular",
                    rows: [
                        { header: "⭐ Full Menu", title: "", description: "Visit all the commands", id: usedPrefix + "allmenu" }
                    ]
                }
            ]
        });

        const interactiveMessage = {
            body: { text: `Hello 👋, ${senderTag}` },
            footer: { text: "@_mouad_ad_" },
            header: {
                hasMediaAttachment: true,
                ...await prepareWAMessageMedia({
                    image: imageBuffer // Use the generated image buffer
                }, {
                    upload: conn.waUploadToServer
                })
            },
            nativeFlowMessage: {
                buttons: [{
                    name: "single_select",
                    buttonParamsJson
                }]
            }
        };

        const message = {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage
        };

        await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {});
    } catch (e) {
        console.log(e);
    }
};

handler.command = /^(menu)$/i;
export default handler;

async function genProfile() {
    try {
        // Generate an image using JIMP
        const image = await jimp.read('https://telegra.ph/file/25138d52d9359a658c727.jpg'); // Use your image URL
        image.resize(256, 256); // Resize the image if necessary
        return await image.getBufferAsync(jimp.MIME_JPEG); // Return the image buffer
    } catch (e) {
        console.log(e);
        return null;
    }
}