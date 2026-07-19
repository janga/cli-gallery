import path from 'node:path';
import { createRequire } from 'node:module';
import {
	engineRoot,
	siteProjectRoot,
} from './site-paths.mjs';
import { runInherit } from './run-command.mjs';

const require = createRequire(import.meta.url);
const astroPackagePath = require.resolve('astro/package.json');
const astroPackage = require(astroPackagePath);

export const astroBinPath = path.join(path.dirname(astroPackagePath), astroPackage.bin.astro);
export const astroConfigPath = 'astro.config.mjs';

export const getAstroArgs = (args) => [
	astroBinPath,
	'--root',
	engineRoot,
	'--config',
	astroConfigPath,
	...args,
];

export const runAstroInherit = (args, options = {}) => runInherit(
	process.execPath,
	getAstroArgs(args),
	{
		cwd: siteProjectRoot,
		...options,
	},
);
