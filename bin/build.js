import tstl from 'typescript-to-lua';
import path from 'path';
import fsPromise from 'node:fs/promises';
import fs from 'fs';
import { genImport } from 'knitwork';
import ts from 'typescript';

import { getAoe4Config, defaultFunctions, printToConsole } from './utils.js';

export const aoe4ModBuild = async () => {
	try {
		const timeStart = new Date();

		const aoe4Dir = path.resolve('.aoe4');
		const srcDir = path.resolve('src');
		const workingDir = path.resolve('.');

		const aoe4Config = getAoe4Config(workingDir);

		const imports = [];
		for (const mod of aoe4Config.registerMods) {
			for (const defaultFunction of defaultFunctions) {
				imports.push(`${mod}_${defaultFunction}`);
			}
		}

		for (const [entrypoint, exitpoint] of aoe4Config.mappings) {
			const tstlConfig = tstl.parseConfigFileWithSystem(path.resolve(aoe4Dir, 'tsconfig.json'));

			tstlConfig.options.luaBundle = path.resolve(workingDir, exitpoint);
			tstlConfig.options.luaBundleEntry = path.resolve(workingDir, entrypoint);

			const host = ts.createCompilerHost(tstlConfig.options)

			let system = ts.sys;
			host.readFile = (fileName) => {
				let fileText = system.readFile(fileName);
				
				if (fileName.slice(fileName.length - 5) !== '.d.ts' && fileName.includes(workingDir)) {
					const importsText = genImport('#imports', imports)
					fileText = `${importsText}\n\n${fileText}`
				}

				if (aoe4Config?.build?.transform?.input) fileText = aoe4Config.build.transform.input(fileName, fileText);
				return fileText;
			}

			const program = ts.createProgram(tstlConfig.fileNames, tstlConfig.options, host);
			new tstl.Transpiler().emit({ program, writeFile: (filePath, fileText) => {
				if (filePath === tstlConfig.options.luaBundle) {
					let registerMods = ''
					for (const mod of aoe4Config.registerMods) {
						registerMods += `Core_RegisterModule("${mod}")\n`
					}
					fileText = `${registerMods}\n${fileText}`
				}

				fileText = fileText.replaceAll('importScar', 'import');

				const requireRegex = /require\("([^"]*#imports)"\)/g;
				fileText = fileText.replaceAll(requireRegex, 'require(".aoe4.ModFunctions")');

				if (aoe4Config?.build?.transform?.output) [filePath, fileText] = aoe4Config.build.transform.output(filePath, fileText);

				fs.mkdirSync(path.dirname(filePath), { recursive: true });
				fs.writeFileSync(filePath, fileText);
			}})
		}

		const timeStop = new Date();
		printToConsole(`${'✔'.green} Build succeeded in ${timeStop - timeStart}ms`)
	} catch (error) {
		console.error(error)
		printToConsole(`${'✗'.red} Build failed!`)
	}
}
