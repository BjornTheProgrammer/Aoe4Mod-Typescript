export type Aoe4Config = {
	mappings: [string, string][],
	registerMods: string[],
	build?: {
		transform?: {
			input?: (filePath: string, fileText: string) => string
			output?: (filePath: string, fileText: string) => [string, string]
		}
	}
}

export function defineAoe4Config(aoe4Config: Aoe4Config): Aoe4Config {
	return aoe4Config;
};
