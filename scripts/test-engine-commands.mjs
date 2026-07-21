import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(repoRoot, 'bin', 'cli-gallery.mjs');
const packageJson = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8'));
const tempRoot = await mkdtemp(path.join(tmpdir(), 'cli-gallery-engine-commands-'));

const runCli = (args, options = {}) => spawnSync(process.execPath, [cliPath, ...args], {
	cwd: repoRoot,
	encoding: 'utf8',
	...options,
});

try {
	const versionResult = runCli(['engine:version']);
	assert.equal(versionResult.status, 0, versionResult.stderr || versionResult.stdout);
	assert.match(versionResult.stdout, /cli-gallery engine:version/);
	assert.match(versionResult.stdout, new RegExp(`Installed cli-gallery: ${packageJson.version.replaceAll('.', '\\.')}`));
	assert.match(versionResult.stdout, /Installed Astro: /);

	const initializedSiteRoot = path.join(tempRoot, 'initialized-site');
	const initResult = runCli(['init', initializedSiteRoot]);
	assert.equal(initResult.status, 0, initResult.stderr || initResult.stdout);
	assert.match(initResult.stdout, /Created cli-gallery site at /);

	const initializedPackageJson = JSON.parse(await readFile(path.join(initializedSiteRoot, 'package.json'), 'utf8'));
	assert.equal(initializedPackageJson.dependencies['@janga/cli-gallery'], packageJson.version);

	const initAgainResult = runCli(['init', initializedSiteRoot]);
	assert.notEqual(initAgainResult.status, 0);
	assert.match(initAgainResult.stderr, /Target directory must be empty/);

	const updateFromEngineResult = runCli(['engine:update', '--skip-checks']);
	assert.notEqual(updateFromEngineResult.status, 0);
	assert.match(updateFromEngineResult.stderr, /must be run from a site repository/);

	const releaseHelpResult = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', 'release.mjs'), 'patch', '--help'], {
		cwd: repoRoot,
		encoding: 'utf8',
	});
	assert.equal(releaseHelpResult.status, 0, releaseHelpResult.stderr || releaseHelpResult.stdout);
	assert.match(releaseHelpResult.stdout, /Usage: node scripts\/release\.mjs/);

	console.log('ok - engine commands report versions, initialize sites, guard engine self-updates, and document release usage');
} finally {
	await rm(tempRoot, { force: true, recursive: true });
}
