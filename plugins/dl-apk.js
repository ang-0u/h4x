import { search, download } from "aptoide-scraper";

const handler = async (m, { conn, usedPrefix: prefix, command, text }) => {
  try {
    await m.reply('_Downloading in progress, please wait..._');

    const searchResults = await search(text);
    if (!searchResults || searchResults.length === 0) {
      throw 'No results found for the specified query.';
    }
    
    const appData = await download(searchResults[0].id);
    
    // Removing the message and image of the application
    // await conn.sendMessage(
    //   m.chat,
    //   { image: { url: appData.icon }, caption: response },
    //   { quoted: m },
    // );
    
    const response = "Here is the requested app.";
    await conn.sendMessage(
      m.chat,
      {
        document: { url: appData.dllink },
        mimetype: "application/vnd.android.package-archive",
        fileName: appData.name + ".apk",
        caption: response, // Sending the response here
      },
      { quoted: m },
    );
  } catch (error) {
    console.error(error);
    throw `Error: ${error.message || 'An error occurred while processing your request. Please try again later.'}`;
  }
};

handler.command = /^(apk)$/i;
export default handler;