import { search, download } from "aptoide-scraper";
const handler = async (m, { conn, usedPrefix: prefix, command, text }) => {
  if (!text)
    throw `*اكتب تطبيق الدي تريد تحميله متل:*\n\n.apk Minicraft`;
  try {
    const searchA = await search(text);
    const data5 = await download(searchA[0].id);
    let response = `*Name :* ${data5.name}\n*Package :* ${data5.package}\n*Last Update :* ${data5.lastup}\n*Size :* ${data5.size}`;
    await conn.sendMessage(
      m.chat,
      { image: { url: data5.icon }, caption: response },
      { quoted: m },
    );
    if (data5.size.includes("GB") || data5.size.replace(" MB", "") > 1000) {
      return await conn.sendMessage(
        m.chat,
        { text: "The apk file is too large. Maximum download size is 1Gb." },
        { quoted: m },
      );
    }
    await conn.sendMessage(
      m.chat,
      {
        document: { url: data5.dllink },
        mimetype: "application/vnd.android.package-archive",
        fileName: data5.name + ".apk",
        caption: null,
      },
      { quoted: m },
    );
  } catch {
    throw `Error, no se encontrarón resultados para su búsqueda.`;
  }
};
handler.command = /^(apk)$/i;
export default handler;
handler.premium = true