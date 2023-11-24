# Aoe4Mod-Typescript
A tool for making aoe4 mods with TypeScript.

## Usage

```bash
npx aoe4mod
```

```
USAGE aoe4mod init|prepare|build|dev

COMMANDS:
    init <name>  initialize aoe4mod with <name>
    prepare      prepare aoe4mod
    build        build aoe4mod
    dev          run aoe4mod in dev mode
```

## Start Project

Starts a project using a basic template.

```bash
npx aoe4mod init <name>
```

### Project Structure

The basic template will include the following files.

```
<name>
├── .aoe4
├── src/
│   └── main.ts
├── aoe4.config.ts
└── tsconfig.json
```

- `.aoe4` is where the types will automatically be generated to, along with some other internal files.
- `src/` is where all of your files should go. 
- `aoe4.config.ts` will contain the `defineAoe4Config` function. You should update this with your specific project details
- `tsconfig.json` is the main tsconfig file for your program. Do not modify unless you know what you are doing.

### Customization

You can customize the build process by using `defineAoe4Config`. Start by specifying the mod(s) you wish to register. Add the entrypoint of your program, additionally specify where you want the exitpoint for that file to be. It is recommended to put this in your Aoe4 Mod `assest` folder. Additionally you can extend functionality of the build process by accessing the input and output files before they are written to add your own changes.

```ts
export default defineAoe4Config({
	// Register mod, allows for auto import and typing of MyMod_OnInit, MyMod_Start, etc
	registerMods: [ 'MyMod' ],
	mappings: [
		// entrypoint     exitpoint
		['./src/main.ts', './mod/main.scar']
	],
	build: {
		transform: {
			// modify the input files which go into typescript-to-lua
			input: (filePath, fileText) => {
				return fileText;
			},
			// modify the output files which are saved to path;
			output: (filePath, fileText) => {
				return [filePath, fileText]
			},
		}
	}
})
```

### Dev Mode

You can run your project in dev mode, which will automatically compile and output your updated scar files by using the command:
```bash
npm run dev
```

## Acknowledgements

Large amounts of inspiration came from [Age of Empires 4 TypeScript template](https://github.com/aoemods/aoe4-typescript-template) by [RobinKa](https://github.com/RobinKa).

## License

This project is licensed under MIT.

