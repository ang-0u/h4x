// Define your utility functions here
function sort(property, ascending = true) {
  if (property) {
    return (a, b) => (ascending ? a[property] - b[property] : b[property] - a[property]);
  } else {
    return (a, b) => (ascending ? a - b : b - a);
  }
}

function toNumber(property, _default = 0) {
  if (property) {
    return (a, i, b) => {
      return { ...b[i], [property]: a[property] === undefined ? _default : a[property] };
    };
  } else {
    return (a) => (a === undefined ? _default : a);
  }
}

function enumGetKey(a) {
  return a.jid;
}

// Your handler function
let handler = async (m, { conn, args, participants }) => {
  let users = Object.entries(global.db.data.users).map(([key, value]) => {
    return { ...value, jid: key };
  });

  let user = users.find(u => u.jid === m.sender);

  // Define 'usersexp' and 'userslimit' here
  let usersExp = users.map(toNumber('exp')).sort(sort('exp'));
  let usersLimit = users.map(toNumber('limit')).sort(sort('limit'));

  // Add the role text to the message
  let text = `
_*< Your account />*_

- *Name : ${user.name}*
- *Age : ${user.age}*
- *Limit : ${user.limit}*
- *Exp : ${user.exp}*
`.trim();

  // Add guidance for adding country (if needed)
  // text += ``

  m.reply(text, null, { mentions: conn.parseMention(text) });
};

handler.help = ['top'];
handler.tags = ['xp'];
handler.command = ['info'];
handler.register = true;
handler.fail = null;
handler.exp = 0;

export default handler;