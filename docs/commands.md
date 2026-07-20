# Commands

The `cli-gallery` binary is the stable command surface. The starter's npm
scripts are thin aliases around these commands.

## CLI Commands

```sh
cli-gallery dev:local
cli-gallery dev:restart
cli-gallery dev:status
cli-gallery dev:logs
cli-gallery dev:stop
cli-gallery config:check
cli-gallery content:check
cli-gallery content:sync
cli-gallery site:public
cli-gallery images
cli-gallery build
cli-gallery build:local
cli-gallery deploy
cli-gallery deploy:commit
cli-gallery deploy:watch
cli-gallery preview
cli-gallery astro
cli-gallery doctor
```

Global options:

```sh
cli-gallery --site-dir <path> <command>
cli-gallery --help
```

`cli-gallery dev` is accepted as an alias for `dev:local`. `help`, `-h`, and
`--help` print usage.

## Starter npm Scripts

The starter defines:

```sh
npm run dev
npm run dev:local
npm run dev:restart
npm run dev:status
npm run dev:logs
npm run dev:stop
npm run config:check
npm run content:check
npm run content:sync
npm run site:public
npm run images
npm run build
npm run build:local
npm run deploy
npm run deploy:commit
npm run deploy:watch
npm run doctor
npm run preview
```

`npm run dev` calls `npm run dev:local`.

## Command Summary

- `doctor`: prints resolved engine root, site project root, site directory,
  content/config/image/public paths, generated manifest, Astro output paths, and
  cache path.
- `config:check`: validates `site/config.mjs` against the runtime config
  reader.
- `content:check`: validates section structure and gallery references, then
  runs `astro sync`.
- `content:sync`: rewrites Markdown section order and moves misplaced referenced
  image files after confirmation.
- `site:public`: copies `site/public/` into `site/.cli-gallery/public/` and
  removes stale copied static files.
- `images`: generates WebP variants and writes
  `site/.cli-gallery/generated-images.json`.
- `build`: runs config check, content check, public sync, image generation, and
  Astro build.
- `build:local`: runs `build` and restarts `dev:local`.
- `dev:local`: starts Astro dev in background mode on `localhost:4321`.
- `dev:restart`, `dev:status`, `dev:logs`, `dev:stop`: manage the local dev
  server tracked under `.astro/`.
- `preview`: runs Astro preview with the `cli-gallery` Astro config.
- `astro`: runs Astro with the `cli-gallery` Astro config.
- `deploy`: builds and publishes an already committed deploy branch.
- `deploy:commit`: older convenience flow that builds, stages allowed site
  changes, commits, pushes, and checks Pages.
- `deploy:watch`: follows a GitHub Pages workflow run.

## Deploy Watch Options

`deploy:watch` accepts:

```sh
--repo <owner/name>
--workflow <name>
--branch <name>
--sha <sha>
--site-url <url>
--interval <duration>
--timeout <duration>
--limit <count>
```

Durations may use `ms`, `s`, or `m`, for example `500ms`, `10s`, or `15m`.
Without `--sha`, the current `HEAD` is monitored.
