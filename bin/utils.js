import jiti from 'jiti';
import stripAnsi from 'strip-ansi';
import path from 'path'

export const getAoe4Config = (rootDir) => {
	globalThis.defineAoe4Config = (c) => c;
	const result = jiti(rootDir, { interopDefault: true, esmResolve: true })(
		'./aoe4.config',
	);
	delete globalThis.defineAoe4Config;
	return result;
}

export const defaultFunctions = ['OnGameSetup', 'PreInit', 'OnInit', 'Start', 'OnPlayerDefeated', 'OnGameOver']

export function *walkSync(dir) {
	const files = fs.readdirSync(dir, { withFileTypes: true });
	for (const file of files) {
		if (file.isDirectory()) {
			yield* walkSync(path.join(dir, file.name));
		} else {
			yield path.join(dir, file.name);
		}
	}
}

export const printToConsole = (message) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString().grey;

    const terminalWidth = process.stdout.columns || 80; // Default to 80 if terminal width is not available
    const timeLength = stripAnsi(formattedTime).length;
    const messageLength = stripAnsi(message).length;

    console.log(`${message}${' '.repeat(terminalWidth - (messageLength + timeLength))}${formattedTime}`);
};

export const isSubdirectory = (parent, dir) => {
	const relative = path.relative(parent, dir);
	return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}
