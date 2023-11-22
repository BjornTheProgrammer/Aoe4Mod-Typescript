import path from 'path';
import chokidar from 'chokidar';

import * as prepare from './prepare.js';
import * as build from './build.js';

export const aoe4ModDev = async () => {
	const srcDir = path.resolve('src');
	console.log(`Listening to all changes in ${srcDir}`);
	prepare.aoe4ModPrepare();
	build.aoe4ModBuild();
	console.log('')

	chokidar.watch(srcDir, {
		ignored: /(^|[\/\\])\../, // ignore dotfiles
  		persistent: true,
  		ignoreInitial: true
	}).on('all', (event, path) => {
		prepare.aoe4ModPrepare();
		build.aoe4ModBuild();
		console.log('')
	});
}
