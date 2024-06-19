import axios from 'axios';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import cheerio from 'cheerio';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent } = pkg;

let handler = async (m, { conn, args, usedPrefix, text, command }) => {

    let lister = [
        "search",
        "chapter",
        "pdf"
    ];

    let [feature, inputs] = text.split("|").map(v => v.trim());
    if (!lister.includes(feature)) {
        return m.reply(`هذا الامر خاص بتحميل قصص المانغا على شكل pdf مثال نكتب هكذا\n\n\`.manga search|naruto\`\n\n\n*الأوامر التي سوف تستعملها في هذا الأمر*\n${lister.map(v => `  ○ ${v}`).join("\n")}`);
    }

    if (feature === "search") {
        if (!inputs) return m.reply("```Exemple: .manga search|naruto```");
        await m.reply("Searching, please wait...");
        try {
            let res = await search3asq(inputs);
            if (res.length === 0) return m.reply("No results found.");
            let listSections = [
                {
                    title: "Results",
                    rows: res.map(item => ({
                        title: item.name,
                        description: `Alternative Names: ${item.alternativeNames}\nGenres: ${item.genres}`,
                        rowId: `chapter|${item.link}`
                    }))
                }
            ];

            const buttonParamsJson = JSON.stringify({
                title: "Search Results",
                sections: listSections
            });

            const interactiveMessage = {
                body: { text: `Search results for: ${inputs}` },
                footer: { text: "Footer" },
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
            console.error(e);
            await m.reply('Error while searching. Please try again.');
        }
    }

    if (feature === "chapter") {
        if (!inputs) return m.reply("```Exemple: .manga chapter|link```");
        await m.reply("Fetching chapters, please wait...");
        try {
            let res = await getAllChapters(inputs);
            if (res.length === 0) return m.reply("No chapters found.");
            let listSections = [
                {
                    title: "Chapters",
                    rows: res.map(item => ({
                        title: item.title,
                        description: `Release Date: ${item.releaseDate}\nViews: ${item.views}`,
                        rowId: `pdf|${item.link}`
                    }))
                }
            ];

            const buttonParamsJson = JSON.stringify({
                title: "Chapters List",
                sections: listSections
            });

            const interactiveMessage = {
                body: { text: `Chapters list:` },
                footer: { text: "Footer" },
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
            console.error(e);
            await m.reply('Error while fetching chapters. Please try again.');
        }
    }

    if (feature === "pdf") {
        if (!inputs) return m.reply("```Exemple: .manga pdf|link```");
        await m.reply("Creating PDF, please wait...");
        try {
            let data = await getChapterPdf(inputs);
            if (!data) return m.reply('Error while creating PDF. No images found.');
            const [, mangaTitle, chapterNumber] = inputs.match(/manga\/([^/]+)\/(\d+)\/$/);
            const pdfTitle = `${mangaTitle.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())} : ${chapterNumber}`;

            await conn.sendFile(m.chat, data, pdfTitle, "DONE", m, null, {
                mimetype: 'application/pdf',
                contextInfo: {
                    mentionedJid: [m.sender]
                }
            });
        } catch (e) {
            console.error(e);
            await m.reply('Error while creating PDF. Please try again.');
        }
    }
};

handler.help = ["manga"];
handler.tags = ["anime"];
handler.command = /^(manga)$/i;
export default handler;

/* Helper Functions */
async function search3asq(q) {
    try {
        const { data } = await axios.get(`https://3asq.org/?s=${q}&post_type=wp-manga`);
        const $ = cheerio.load(data);

        return $('.tab-summary').map((index, element) => ({
            name: $(element).find('.post-title h3 a').text().trim(),
            link: $(element).find('.post-title h3 a').attr('href'),
            alternativeNames: $(element).find('.mg_alternative .summary-content').text().trim(),
            genres: $(element).find('.mg_genres .summary-content a').map((i, el) => $(el).text()).get().join(', ')
        })).get();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getAllChapters(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        return $('.wp-manga-chapter').map((index, element) => ({
            title: $(element).text().trim(),
            link: $(element).find('a').attr('href'),
            releaseDate: $(element).find('.chapter-release-date i').text().trim(),
            views: $(element).find('.view').text().trim(),
        })).get();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function getChapterPdf(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const buffers = [];
        const pdfDoc = new PDFDocument();
        const pdfStream = new PassThrough();
        pdfDoc.pipe(pdfStream);

        const imageLinks = $('.wp-manga-chapter-img').map((index, element) =>
            $(element).attr('src').trim()).get();

        if (imageLinks.length === 0) {
            console.log('No images found.');
            return null;
        }

        for (const imageLink of imageLinks) {
            try {
                const imageResponse = await axios.get(imageLink, { responseType: 'arraybuffer' });
                pdfDoc.addPage().image(Buffer.from(imageResponse.data), { fit: [pdfDoc.page.width, pdfDoc.page.height] });
            } catch (error) {
                console.error(`Error processing image:`, error);
            }
        }

        pdfDoc.end();

        pdfStream.on('data', chunk => buffers.push(chunk));

        return new Promise(resolve => pdfStream.on('end', () => resolve(Buffer.concat(buffers))));
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};