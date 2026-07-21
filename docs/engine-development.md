# Engine Development

This document is for work on the reusable `cli-gallery` package itself.

## Main Areas

- `bin/cli-gallery.mjs`: public CLI dispatcher.
- `scripts/lib/site-paths.mjs`: engine/site path resolution.
- `scripts/lib/project-config.mjs`: `site/config.mjs` validation and defaults.
- `scripts/sync-content-sections.mjs`: content validation and sync behavior.
- `scripts/generate-images.mjs`: WebP image pipeline and manifest.
- `scripts/sync-site-public.mjs`: static public file sync.
- `scripts/deploy-site.mjs`: deploy and deploy:commit behavior.
- `scripts/watch-pages-deploy.mjs`: GitHub Pages workflow monitor.
- `src/content.config.ts`: Astro content schema.
- `src/components/` and `src/layouts/`: rendered page, navigation, gallery, and
  layout.
- `tests/`: Playwright navigation diagnostics.
- `fixtures/basic/site/`: minimal site used for engine checks.
- `starters/basic/`: copyable site starter.

The repository-local `site/` directory is a dog-gallery demo. It is useful for
manual engine checks, but it is not a published site.

## Common Checks

Run focused checks while developing:

```sh
npm run test:content-check
npm run test:site-public
npm run test:fixture:build
npm run demo:build
npm run package:check
```

`npm run test` runs the same set in sequence.

Navigation diagnostics are separate because they use Playwright:

```sh
npm run test:navigation
npm run test:navigation:stress
npm run test:navigation:preview
```

If Chromium is missing:

```sh
npx playwright install chromium
```

## Package Check

`npm run package:check` packs this repository, extracts the package, copies the
packaged starter into a temporary site project, installs dependencies, runs
`cli-gallery doctor` from a site subdirectory, runs config/content checks,
builds the installed site, and verifies selected rendered output and validation
failures.

It needs network access when npm dependencies are not already cached.
The check uses a reusable npm cache at
`node_modules/.cache/cli-gallery-package-check-npm` and runs npm with
`--prefer-offline` so repeat runs do not redownload dependencies. Set
`CLI_GALLERY_PACKAGE_CHECK_CACHE=/path/to/cache` to use another cache.

## Manual npm Release

The npm package is published under the `@janga` scope. For a manual public
release, set the intended version in `package.json` and `package-lock.json`,
verify the package contents, then publish from this repository:

```sh
npm pack --dry-run
npm run release:publish
```

The same publish shortcut can be started from any directory:

```sh
npm --prefix /Users/jangarefelt/Projects/cli-gallery run release:publish
```

After publication, site repositories should depend on the exact published npm
version and commit their updated `package-lock.json`.

## Rendering Notes

The renderer builds one static page at `/`. Section navigation uses real
`href="#section-id"` links and progressively enhances them with JavaScript when
available. The sticky navigation updates root scroll offset variables so direct
hash links and clicked links land below the fixed header.

The current shared layout contains Swedish UI labels such as the skip link and
navigation labels. Treat that as current implementation behavior when planning
broader reuse.
