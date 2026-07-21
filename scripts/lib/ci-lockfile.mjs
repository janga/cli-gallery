import { runInherit } from './run-command.mjs';

export const ciNpmVersion = '11.16.0';

const ciPlatformArgs = [
	'--os=linux',
	'--cpu=x64',
	'--libc=glibc',
];

const npmCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const getNpmArgs = (command, args = []) => [
	'--yes',
	`npm@${ciNpmVersion}`,
	command,
	...args,
	'--ignore-scripts',
	'--no-audit',
	'--no-fund',
	...ciPlatformArgs,
];

export const normalizeCiLockfile = (cwd, options = {}) => runInherit(
	npmCommand,
	getNpmArgs('install', ['--package-lock-only']),
	{ cwd, ...options },
);

export const verifyCiLockfile = (cwd, options = {}) => runInherit(
	npmCommand,
	getNpmArgs('ci', ['--dry-run']),
	{ cwd, ...options },
);
