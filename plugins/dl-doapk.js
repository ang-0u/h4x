import { search } from "aptoide-scraper";
import pkg from '@whiskeysockets/baileys';
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = pkg;

const searchHandler = async (m, { conn, prefix }) => {
    const query = m.text.trim().split(/ +/).slice(1).join(" ");
    if (!query) return await conn.reply(m.chat, `*Please type the name of the app you want to download, e.g.:*\n\n.apk Minecraft`, m);

    try {
        const searchResults = await search(query);
        if (searchResults.length === 0) throw "No results found for your search."

        const buttonParamsJson = JSON.stringify({
            title: "Show Options",
            sections: [
                {
                    title: "Search Results",
                    rows: searchResults.map((result, index) => ({
                        header: `${result.name}`,
                        title: " ",
                        id: `.apk3 ${result.name}`,
                        description: ` ${result.id || 'Not available'}`
                    }))
                }
            ]
        });

        const wm = "Please waitt......";
        const info = "*Please click the button below to Follow my channel*".trim();
        const thumbnailUrl = 'https://telegra.ph/file/13240ca790280f569b410.jpg'; // Replace with actual thumbnail URL

        await conn.sendButton(
            m.chat, 
            wm, 
            info, 
            thumbnailUrl, 
            [
                ['Owner 👤', '/owner']
            ], 
            null, 
            [
                ['Follow instagram', `https://www.instagram.com/_mouad_ad_?igsh=ZGUzMzM3NWJiOQ==`]
            ], 
            m, 
            {
                contextInfo: {
                    mentionedJid: [m.sender]
                }
            }
        );

        const interactiveMessage = {
            body: { text: `Search results for: ${query}` },
            footer: { text: "@FunDoo" },
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
        console.log(e)
    }
};

searchHandler.command = /^(apk)$/i;
searchHandler.limit = 5

export default searchHandler;