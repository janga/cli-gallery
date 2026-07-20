# Local Development

Use the local preview commands when editing a site or the engine demo.

## Start Preview

```sh
npm run dev:local
```

The wrapper:

1. syncs `site/public/` into `site/.cli-gallery/public/`,
2. starts Astro in background mode,
3. waits until the site responds,
4. opens `http://localhost:4321/` unless `WALDE_NO_OPEN=1` is set.

The host and port are currently fixed in the script:

```text
localhost:4321
```

If the port is already in use, the command fails and asks you to stop the
process using it.

## Manage Preview

```sh
npm run dev:status
npm run dev:logs
npm run dev:logs -- --follow
npm run dev:restart
npm run dev:stop
```

The local server state and logs live under `.astro/`.

## Rebuild Stale Preview

Use this when generated content or image state looks stale:

```sh
npm run build:local
```

It runs the full build and restarts the local dev server without opening a new
browser window.
