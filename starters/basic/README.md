# cli-gallery Starter

This is a minimal site repository starter for `@janga/cli-gallery`.

## Setup

```sh
npm install
npm run dev:local
```

Edit site-specific content in `site/content.md`, technical settings in
`site/config.mjs`, source images under `site/images/<section-id>/`, and static
public files under `site/public/`.

Commit `package-lock.json` after the first install so GitHub Actions can use
`npm ci`.

Use `npm run engine:version` to inspect the installed engine and
`npm run engine:update` to update it.

Generic documentation lives in the `cli-gallery` repository:

- `docs/getting-started.md`
- `docs/site-structure.md`
- `docs/content.md`
- `docs/configuration.md`
- `docs/commands.md`
- `docs/images-and-metadata.md`
- `docs/publishing.md`
