## Agent Instructions

`README.md` is the canonical project manual. Read it before changing this
project.

Keep this file limited to agent operating rules. If a fact is useful to a human
maintainer, put it in `README.md` instead of duplicating it here.

## Working Rules

- Keep changes small and focused.
- Do not create branches unless the user asks for one.
- Do not push uncommitted changes.
- Before committing, run `git status --short` and make sure untracked files are
  intentional.
- Commit before pushing.
- Do not run `npm run deploy:watch` in this engine repository unless the user
  explicitly asks for it. Deploy monitoring is for site repositories.
- Keep technical project settings in `site/config.mjs`; do not hardcode the
  public URL, GitHub repo, deploy branch, Pages workflow name, footer text,
  smooth-scroll timing, or image metadata policy in scripts or components.
- The site source directory defaults to `site/` and can be overridden with
  `CLI_GALLERY_SITE_DIR`; use `scripts/lib/site-paths.mjs` instead of
  hardcoding site paths in scripts.
- Keep editable content, section definitions, image references, gallery alt
  text, and captions in the selected site `content.md`; the default path is
  `site/content.md`. Use `fixtures/basic/site` for standalone engine checks.
- Keep site-specific static files in the selected site `public/`; the default
  path is `site/public/`. The selected site's `.cli-gallery/public/` directory
  is copied build preparation output plus generated image output.
- Do not add routes or split sections into separate Markdown files unless the
  user explicitly changes the single-page architecture.

## Command Choices

- Start the dev server with `npm run dev:local`. Manage it with
  `npm run dev:stop`, `npm run dev:restart`, `npm run dev:status`, and
  `npm run dev:logs`.
- Run `npm run config:check` after changing `site/config.mjs` or config
  validation behavior.
- Run `npm run content:check` before `npm run build` when changing content or
  gallery images.
- Run `npm run content:sync` after moving gallery rows between sections so image
  files move to the matching section directory.
- Run `npm run metadata:fix` only when new source images need copyright
  metadata, or when build warnings identify missing metadata that should be
  written intentionally.
- Run `npm run site:public` after changing `site/public/` when you need the
  local generated public copy without a full build.
- Run `npm run test:site-public` after changing static-public sync behavior.
- Run `npm run test:fixture:build` after changing package/site-root behavior
  that should work against the minimal fixture.
- Run `npm run package:check` after changing package files, CLI dispatch,
  Astro path resolution, or starter structure.
- Run `npm run build` after content, layout, config, or image-pipeline changes.
- Run `npm run build:local` when a local preview may be using stale content and
  should be rebuilt and restarted.
- Run `npm run test:content-check` after changing content validation or
  `content:sync` behavior.
- Run `npm run test:navigation` after sticky navigation, anchor offset, or
  scroll behavior changes.
- Use `npm run test:navigation:stress` for intermittent anchor navigation
  races.
- Use `npm run test:navigation:preview` for production-like sticky-navigation
  anchor testing against `dist/`.

## Implementation Notes

- Preserve progressive enhancement in section navigation: keep real
  `href="#section-id"` links so anchors work without JavaScript.
- The sticky navigation uses root `scroll-padding-top` to compensate for the
  fixed header area. Avoid section-level `scroll-margin-top` unless you are
  deliberately testing anchor offsets.
- When adding, renaming, or moving sections, keep the frontmatter section `id`,
  the Markdown heading id, and the `site/images/<section-id>/` image directory in
  sync.
- Do not commit unreferenced source images unless the user explicitly asks for
  them.
- If Playwright reports a missing Chromium browser, run
  `npx playwright install chromium` once. In sandboxed Codex sessions,
  Playwright may need escalation to launch Chromium.
