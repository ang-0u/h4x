import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import yargs from 'yargs';
import express from 'express'; // Import express directly
import chalk from 'chalk';
import path from 'path';
import os from 'os';
import { promises as fsPromises, constants as fsConstants } from 'fs'; // Import fsPromises and fsConstants

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url); // Update to createRequire

async function start(file) {
  if (isRunning) return;
  isRunning = true;

  // Create tmp directory if it doesn't exist
  const tmpDirPath = path.join(__dirname, 'tmp');
  try {
    await fsPromises.access(tmpDirPath, fsConstants.F_OK); // Check if directory exists
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Directory does not exist, create it
      try {
        await fsPromises.mkdir(tmpDirPath);
        console.log(chalk.green(`✓ Created tmp directory: ${tmpDirPath}`));
      } catch (mkdirErr) {
        console.error(chalk.red(`❌ Failed to create tmp directory: ${tmpDirPath}`, mkdirErr));
        isRunning = false;
        return;
      }
    } else {
      // Other access error, log and return
      console.error(chalk.red(`❌ Access error for tmp directory: ${tmpDirPath}`, err));
      isRunning = false;
      return;
    }
  }

  // Continue with the rest of the start function...
}
