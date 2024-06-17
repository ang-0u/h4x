import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import yargs from 'yargs';
import chalk from 'chalk';
import path from 'path';
import os from 'os';
import { promises as fsPromises, constants as fsConstants } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const { say } = cfonts;
const rl = createInterface(process.stdin, process.stdout);

say('Gata\nBot\nMD', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta']
});

say(`Por GataDios`, {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta']
});

let isRunning = false;

async function start(file) {
  if (isRunning) return;
  isRunning = true;

  const currentFilePath = new URL(import.meta.url).pathname;
  const args = [join(__dirname, file), ...process.argv.slice(2)];

  say([process.argv[0], ...args].join(' '), {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  });

  setupMaster({ exec: args[0], args: args.slice(1) });
  const p = fork();

  p.on('message', async data => {
    switch (data) {
      case 'reset':
        p.process.kill();
        isRunning = false;
        await start.apply(this, arguments);
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
    }
  });

  p.on('exit', async (_, code) => {
    isRunning = false;
    console.error('⚠️ ERROR ⚠️ >> ', code);
    await start('main.js'); // Restart with main.js or adjust as needed

    if (code === 0) return;

    watchFile(args[0], () => {
      unwatchFile(args[0]);
      start(file);
    });
  });

  const ramInGB = os.totalmem() / (1024 * 1024 * 1024);
  const freeRamInGB = os.freemem() / (1024 * 1024 * 1024);
  const packageJsonPath = path.join(path.dirname(currentFilePath), './package.json');
  const tmpDirPath = path.join(__dirname, 'tmp');

  try {
    // Check if tmp directory exists, create if not
    await fsPromises.access(tmpDirPath, fsConstants.F_OK);
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await fsPromises.mkdir(tmpDirPath);
        console.log(chalk.green(`✓ Created tmp directory: ${tmpDirPath}`));
      } catch (mkdirErr) {
        console.error(chalk.red(`❌ Failed to create tmp directory: ${tmpDirPath}`, mkdirErr));
        isRunning = false;
        return;
      }
    } else {
      console.error(chalk.red(`❌ Access error for tmp directory: ${tmpDirPath}`, err));
      isRunning = false;
      return;
    }
  }

  try {
    const packageJsonData = await fsPromises.readFile(packageJsonPath, 'utf-8');
    const packageJsonObj = JSON.parse(packageJsonData);
    const currentTime = new Date().toLocaleString();

    console.log(chalk.yellow(`╭─────────────────────────────────────┬─────────────────────────────╮`));
    console.log(chalk.yellow(`┊ OS: ${os.type()}, ${os.release()} - ${os.arch()}`));
    console.log(chalk.yellow(`┊ 💾 Total RAM: ${ramInGB.toFixed(2)} GB`));
    console.log(chalk.yellow(`┊ 💽 Free RAM: ${freeRamInGB.toFixed(2)} GB`));
    console.log(chalk.yellow(`╭─────────────────────────────────────┬─────────────────────────────╮`));
    console.log(chalk.yellow(`┊ 💾 Version: ${packageJsonObj.version}`));
    console.log(chalk.yellow(`┊ 💾 Descripción: ${packageJsonObj.description}`));
    console.log(chalk.yellow(`┊ 💾 Autor: ${packageJsonObj.author.name} (@gata_dios)`));
    console.log(chalk.yellow(`┊ 💾 Colaboradores:`));
    console.log(chalk.yellow(`┊    • elrebelde21 (Mario ofc)`));
    console.log(chalk.yellow(`┊    • KatashiFukushima (Katashi)`));
    console.log(chalk.yellow(`┊ 💾 Hora Actual: ${currentTime}`));
    console.log(chalk.yellow(`╰─────────────────────────────────────┬─────────────────────────────╮`));

    setInterval(() => {}, 1000); // Placeholder for any periodic tasks
  } catch (err) {
    console.error(chalk.red(`❌ Failed to read package.json: ${err}`));
  }

  // Optionally handle yargs options or readline logic
}

start('main.js'); // Start with main.js or adjust as needed
