import * as fs from 'fs'
import * as path from 'path'
import { genInlineTypeImport, genExport } from 'knitwork';
import * as colors from 'colors'
import { fileURLToPath } from 'url';

import { getAoe4Config, defaultFunctions, printToConsole } from './utils.js';

const VALID_IDENTIFIER_RE = /^[$_]?\w*$/;
function genObjectKey(key) {
	return VALID_IDENTIFIER_RE.test(key) ? key : genString(key);
}

function wrapInDelimiters(
	lines,
	indent = "",
	delimiters = "{}",
	withComma = true
) {
	if (lines.length === 0) {
		return delimiters;
	}
	const [start, end] = delimiters;
	return (
		`${start}\n` + lines.join(withComma ? ",\n" : "\n") + `\n${indent}${end}`
	);
}

const genTypeObject = (object, indent = "") => {
	const newIndent = indent + "	";
	return wrapInDelimiters(
		Object.entries(object).map(([key, value]) => {
			const [, k = key, optional = ""] =
				key.match(/^(.*[^?])(\?)?$/) /* c8 ignore next */ || [];
			if (typeof value === "string") {
				return `${newIndent}const ${genObjectKey(k)}${optional}: ${value}`;
			}
			return `${newIndent}const ${genObjectKey(k)}${optional}: ${genTypeObject(
				value,
				newIndent
			)}`;
		}),
		indent,
		"{}",
		false
	);
};

const genNamespaceAugmentation = (
	name,
	contents,
	options
) => {
	const result = [
		`declare ${name}`,
		contents ? genTypeObject(contents) : "{}",
	]
		.filter(Boolean)
		.join(" ");
	return result;
};

export const aoe4ModPrepare = async () => {
	try {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);

		const buildDir = path.resolve('.aoe4');
		const aoe4Config = path.resolve('aoe4.config.ts');
		const workingDir = path.resolve('.');
		const resources = path.resolve(__dirname, 'resources');

		if (fs.existsSync(buildDir)) fs.rmSync(buildDir, { recursive: true });
		fs.mkdirSync(buildDir);

		fs.cpSync(path.resolve(resources, 'tsconfig.json'), path.resolve(buildDir, 'tsconfig.json'));
		fs.cpSync(path.resolve(resources, 'aoe4.d.ts'), path.resolve(buildDir, 'aoe4.d.ts'));
		fs.cpSync(path.resolve(resources, 'types', 'config.ts'), path.resolve(buildDir, 'types', 'config.ts'));

		const mods = getAoe4Config(workingDir).registerMods;

		let modFunctionsFileFunctions = `const g = globalThis as any;\n\n`
		const modFileExportsArray = [];
		const augmentations = {};
		for (const mod of mods) {
			for (const defaultFunction of defaultFunctions) {
				modFunctionsFileFunctions += `export function ${mod}_${defaultFunction}(func: Function) {
		g.${mod}_${defaultFunction} = func;
	}\n\n`

				modFileExportsArray.push(`${mod}_${defaultFunction}`);
				augmentations[`${mod}_${defaultFunction}`] = genInlineTypeImport('./ModFunctions', `${mod}_${defaultFunction}`)
			}
		}

		augmentations['defineAoe4Config'] = genInlineTypeImport('./types/config', `defineAoe4Config`)

		const args = genNamespaceAugmentation('global', augmentations);

		fs.writeFileSync(path.resolve(buildDir, 'globals.d.ts'), `export {}\n\n${args}\n`);

		const ModFileExports = genExport('./ModFunctions', modFileExportsArray);
		const ConfigFileExports = genExport('./types/config', ['defineAoe4Config']);
		fs.writeFileSync(path.resolve(buildDir, 'imports.d.ts'), `${ModFileExports}\n${ConfigFileExports}\n`);

		fs.writeFileSync(path.resolve(buildDir, 'ModFunctions.ts'), modFunctionsFileFunctions)

		printToConsole(`${'✔'.green} Types generated in .aoe4`)
	} catch (error) {
		console.error(error)
		printToConsole(`${'✗'.red} Types failed to generate in .aoe4`)
	}
}
