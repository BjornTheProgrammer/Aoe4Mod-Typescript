#! /usr/bin/env node
import * as prepare from './prepare.js'
import * as build from './build.js'
import * as dev from './dev.js'
import * as init from './init.js'

const handleCommand = async () => {
	if (process.argv.length >= 3) {
		if (process.argv[2] === 'init') {
			init.aoe4ModInit();
			return;
		} else if (process.argv[2] === 'prepare') {
			prepare.aoe4ModPrepare();
			return;
		} else if (process.argv[2] === 'build') {
			await prepare.aoe4ModPrepare();
			build.aoe4ModBuild();
			return;
		} else if (process.argv[2] === 'dev') {
			dev.aoe4ModDev();
			return;
		}
	}
	console.log(`${'usage'.toUpperCase().white.underline.bold} ${'aoe4mod init|prepare|build|dev'.cyan}`)
	console.log(`\n${'commands'.toUpperCase().white.underline.bold}:`)
	console.log(`    ${'init <name>'.cyan}  initialize aoe4mod with <name>`)
	console.log(`    ${'prepare'.cyan}      prepare aoe4mod`)
	console.log(`    ${'build'.cyan}        build aoe4mod`)
	console.log(`    ${'dev'.cyan}          run aoe4mod in dev mode`)
	return;
}

handleCommand();
