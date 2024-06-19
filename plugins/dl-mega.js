import { File } from "megajs";

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    try {
        // Check if there is no text provided
        if (!text) return m.reply(`Example :\n${usedPrefix + command} https://mega.nz/file/0FUA2bzb#vSu3Ud9Ft_HDz6zPvfIg_y62vE1qF8EmoYT3kY16zxo`);
        
        // Load file attributes from the provided MEGA URL
        const file = File.fromURL(text);
        await file.loadAttributes();
        
         // Reply that the file is being downloaded
        m.reply(`*_Please wait a few minutes..._*\nDownloading ${file.name}...`);
        
        // Download the file as a buffer
        const data = await file.downloadBuffer();
        
        // Send the file based on its MIME type
        if (/mp4/.test(file.name)) {
            await conn.sendMessage(m.chat, {
                document: data,
                mimetype: "video/mp4",
                filename: `${file.name}.mp4`
            }, {
                quoted: m
            });
        } else if (/pdf/.test(file.name)) {
            await conn.sendMessage(m.chat, {
                document: data,
                mimetype: "application/pdf",
                filename: `${file.name}.pdf`
            }, {
                quoted: m
            });
        } else if (/zip/.test(file.name)) {
            await conn.sendMessage(m.chat, {
                document: data,
                mimetype: "application/zip",
                filename: `${file.name}.zip`
            }, {
                quoted: m
            });
        } else if (/rar/.test(file.name)) {
            await conn.sendMessage(m.chat, {
                document: data,
                mimetype: "application/x-rar-compressed",
                filename: `${file.name}.rar`
            }, {
                quoted: m
            });
        } else if (/7z/.test(file.name)) {
            await conn.sendMessage(m.chat, {
                document: data,
                mimetype: "application/x-7z-compressed",
                filename: `${file.name}.7z`
            }, {
                quoted: m
            });
        } else if (/jpg|jpeg/.test(file.name)) {
            await conn.sendMessage(m.chat, {
                document: data,
                mimetype: "image/jpeg",
                filename: `${file.name}.jpg`
            }, {
                quoted: m
            });
        } else if (/png/.test(file.name)) {
            await conn.sendMessage(m.chat, {
                document: data,
                mimetype: "image/png",
                filename: `${file.name}.png`
            }, {
                quoted: m
            });
        } else {
            // Reply if the file format is not supported
            return m.reply('Error : Unsupported file format');
        }
    } catch (error) {
        // Reply if there is an error during the process
        return m.reply(`Error: ${error.message}`);
    }
}

// Help information for the handler
handler.help = ["mega"];

// Tags associated with the handler
handler.tags = ["downloader"];

// Command pattern associated with the handler
handler.command = /^(mega)$/i;
handler.limit = 4
handler.register = true
// Export the handler function
export default handler;