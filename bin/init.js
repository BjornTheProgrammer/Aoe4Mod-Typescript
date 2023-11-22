import fs from 'fs';
import path from 'path';
import colors from 'colors';
import child_process from 'child_process';
import { fileURLToPath } from 'url';

import { printToConsole } from './utils.js';

export const aoe4ModInit = () => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	const init = path.resolve(__dirname, 'resources', 'init');
	if (process.argv.length != 4) return console.log('Please supply name: aoe4mod init <name>');

	const newProject = path.resolve('.', process.argv[3]);

	fs.cpSync(init, newProject, { recursive: true });

	printToConsole(`${'◐'.magenta} Installing dependencies...`);
	child_process.execSync(`cd ${newProject} && npm install --legacy-peer-deps`, { stdio: 'inherit' });
}
