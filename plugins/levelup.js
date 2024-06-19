//test v3
import { canLevelUp, xpRange } from '../lib/levelling.js';
import { levelup } from '../lib/canvas.js';

const handler = async (m, { conn }) => {
  const name = conn.getName(m.sender);
  const usertag = '@' + m.sender.split('@s.whatsapp.net')[0];
  const user = global.db.data.users[m.sender];

  // Check if the user can level up based on their current experience points and level multiplier
  if (!canLevelUp(user.level, user.exp, global.multiplier)) {
    const { min, xp, max } = xpRange(user.level, global.multiplier);
    const message = `
🏰 *Adventurers Guild*
*Welcome, ${usertag}!*

*◉ Current Level :* ${user.level}
*◉ Current Rank :* ${user.role}
*◉ Experience Points :* ${user.exp - min}/${xp}

*—◉ To level up, you need to earn ${max - user.exp} more experience points. Keep interacting with the bot!*`.trim();
    return conn.sendMessage(m.chat, { text: message, mentions: [m.sender] }, { quoted: m });
  }

  // Store the user's level before attempting to level up
  const before = user.level * 1;

  // Increment the user's level while they can level up
  while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++;

  // Check if the user leveled up
  if (before !== user.level) {
    const levelUpMessage = `🎉 Congratulations, ${name}! You have leveled up to ${user.level}`;
    const levelUpDetails = `
🚀 *New Level Achieved*

*◉ Previous Level :* ${before}
*◉ New Level :* ${user.level}
*◉ Current Rank :* ${user.role}

*—◉ Continue exploring and completing missions to reach new heights in the Adventurers Guild. Keep interacting with the bot!*`.trim();

    try {
      // If generating the image fails, send the level-up details as a text message
      conn.sendMessage(m.chat, { text: levelUpDetails, mentions: [m.sender] }, { quoted: m });
    } catch (e) {
      // Handle the error, log it, or take appropriate action
      console.error(e);
    }
  }
};

// Command information
handler.help = ['levelup'];
handler.tags = ['xp'];
handler.command = ['levelup', 'nivel'];
handler.limit = 1
handler.register = true
export default handler;