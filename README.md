# cli-gallery

`cli-gallery` is a command-line publishing workflow for simple static galleries.
It combines structured content, automated consistency checks, image processing,
and Git-based deployment into a small static-site toolchain.

The tool is designed for single-page gallery sites where content should stay in
plain files, images should be validated before publishing, and deployment should
be repeatable from the command line.

This repository contains the reusable `@janga/cli-gallery` package: the CLI,
Astro renderer, validation scripts, image pipeline, starter project, fixtures,
and deploy helpers. Published sites should live in their own repositories and
depend on a pinned version of this package.

## Use Cases

`cli-gallery` is a good fit for:

- Artist, photographer, designer, or craft portfolios.
- Simple work archives where images, captions, and section order matter.
- Static gallery sites maintained through Git rather than an admin UI.
- Projects that benefit from high-level definition files and automated checks.
- Publishing workflows where validation, image generation, build, push, and
  deploy monitoring should be scriptable.

It is intentionally not a full CMS. It does not provide multi-user editing,
draft workflows, database-backed search, role management, or dynamic runtime
features.

## How It Works

The core model is file-driven:

1. Configure a site in `site/config.mjs`.
2. Define sections, text, gallery image references, alt text, and captions in
   `site/content.md`.
3. Store source images under `site/images/<section-id>/`.
4. Store static site files such as favicons, `robots.txt`, and `CNAME` under
   `site/public/`.
5. Run validation scripts to check configuration, content structure, image
   references, section order, and metadata policy.
6. Generate optimized WebP variants from the referenced source images.
7. Build a static Astro site.
8. Commit, push, and deploy through GitHub Pages.

The two most important project files are:

```text
site/config.mjs
site/content.md
```

`site/` is the default site source directory. Set `CLI_GALLERY_SITE_DIR` or pass
`cli-gallery --site-dir <path> ...` to use another directory with the same
internal structure. When a command is started from a subdirectory, `cli-gallery`
walks upward until it finds the selected site directory.

`site/config.mjs` holds technical project configuration such as public URL,
navigation behavior, footer rendering, image metadata policy, GitHub repository,
deploy branch, and workflow names. `site/content.md` holds editorial content:
section order, section body text, gallery image references, alt text, and
captions.

## Tech Stack

- Astro builds the static single-page site.
- Markdown with frontmatter stores editable content and gallery definitions.
- Node.js scripts validate configuration, validate/sync content, process images,
  and manage deploy checks.
- ImageMagick creates generated WebP image variants.
- `exiftool` checks and writes source image copyright metadata.
- Playwright provides navigation and anchor-scroll diagnostics.
- GitHub Actions builds and publishes the site to GitHub Pages.

Framework-level Astro references:

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)

## Quick Start

### Engine Development

Install dependencies:

```sh
npm install
```

Start a local preview for the demo site in this repository:

```sh
npm run dev:local
```

Run the main engine checks:

```sh
npm run test:fixture:build
npm run package:check
```

`npm run package:check` packs this repository, installs the package into a
temporary starter-based site project, runs commands from both the site root and
a site subdirectory, and builds the site through the installed `cli-gallery`
binary.

### New Site Repository

Copy `starters/basic/` into a new repository, then install dependencies:

```sh
cp -R starters/basic ../my-gallery
cd ../my-gallery
npm install
npm run dev:local
```

The starter depends on `@janga/cli-gallery` through the GitHub tag
`v0.1.7` over HTTPS. Commit the generated `package-lock.json` in the site
repository so local builds and GitHub Actions use the same package version.

## Project Files

The main files and directories in this repository are:

- `bin/cli-gallery.mjs`: command dispatcher exposed as `cli-gallery`.
- `src/`: Astro layout, page rendering, styles, and content integration.
- `scripts/`: command-line validation, image, local preview, and deploy tools.
- `tests/`: Playwright navigation diagnostics.
- `site/`: local dog gallery demo used by default in this repository.
- `fixtures/basic/site/`: minimal fixture for engine regression tests.
- `starters/basic/`: copyable starter for a separate site repository.

A site repository provides the site-specific files:

- `site/config.mjs`: technical site configuration in the default site
  directory.
- `site/content.md`: editable content, sections, gallery rows, alt text, and
  captions.
- `site/images/<section-id>/`: source images for each section.
- `site/public/`: static site-specific files copied directly into the published
  site.

There is a complete file map near the end of this README.

## Requirements

The project expects:

- Node.js `>=22.12.0`.
- ImageMagick, either `magick` or the older `identify` and `convert` commands,
  for local image generation.
- `exiftool` for build-time image metadata warnings and `metadata:fix`.
- GitHub CLI (`gh`) for deploy checks and deploy monitoring.
- Playwright Chromium when running navigation diagnostics.

Install Playwright Chromium with:

```sh
npx playwright install chromium
```

GitHub Actions installs the image tools during deploy, so the local image tool
requirement only applies when building on your machine.

## Recommended Workflow

For ordinary content, layout, or image work in a site repository, use this flow:

| Step | What to do | How to do it |
| --- | --- | --- |
| 1 | Start a local preview when visual feedback is useful. | `npm run dev:local` |
| 2 | Edit site content and gallery references. | Edit `site/content.md` and source images under `site/images/<section-id>/`. |
| 3 | Validate project configuration. | `npm run config:check` |
| 4 | Validate content and gallery references. | `npm run content:check` |
| 5 | Repair section order or moved gallery images when needed. | `npm run content:sync` |
| 6 | Add missing source image metadata when appropriate. | `npm run metadata:fix` |
| 7 | Build locally for confidence. | `npm run build` |
| 8 | Review and commit the intended changes. | Check `git status --short` and `git diff`, then commit. |
| 9 | Deploy the already committed deploy branch. | `npm run deploy` |
| 10 | Monitor the GitHub Pages workflow when wanted. | `npm run deploy:watch` |

In command form:

```sh
npm run dev:local
npm run config:check
npm run content:check
npm run build
git status --short
git diff
git add ...
git commit -m "Describe the change"
npm run deploy
npm run deploy:watch
```

`npm run deploy` runs `npm run build` before it pushes, so the manual build
step is for local confidence rather than a technical requirement.

For engine work in this repository, prefer:

```sh
npm run test:content-check
npm run test:site-public
npm run test:fixture:build
npm run demo:build
npm run package:check
```

## Local Preview

Start the local Astro dev server with:

```sh
npm run dev:local
```

The wrapper starts Astro in background mode at `http://localhost:4321/` and
opens that URL in the browser. Manage the background server with:

```sh
npm run dev:status
npm run dev:logs
npm run dev:logs -- --follow
npm run dev:restart
npm run dev:stop
```

Use `build:local` when content or gallery changes do not appear in the dev
server, or when you want a full local build followed by a dev-server restart:

```sh
npm run build:local
```

## Configuration

Keep technical project configuration in `site/config.mjs`, not in
`site/content.md`. Treat `site/config.mjs` as a per-site file when preparing a
reusable starter or engine repository.

The site source directory defaults to `site/`. To run the same code against a
different site directory, set `CLI_GALLERY_SITE_DIR` or pass `--site-dir` before
the command:

```sh
CLI_GALLERY_SITE_DIR=my-site npm run build
npx cli-gallery --site-dir my-site build
```

The selected directory must contain `config.mjs`, `content.md`, optional static
files under `public/`, and source images under `images/<section-id>/`. If a
command starts below the site repository root, `cli-gallery` walks upward until
it finds `<site-dir>/config.mjs` and `<site-dir>/content.md`. Update the
`CLI_GALLERY_SITE_DIR` value in a site repository's deploy workflow too if that
repository deploys from a directory other than `site/`.

`site/config.mjs` defines:

- `site.url`: the public canonical URL used by the layout and deploy monitor.
- `navigation.smoothScroll`: controlled anchor scroll behavior and timing.
- `images.warnOnMissingCopyrightMetadata`: whether image generation warns when
  source images lack copyright or creator metadata.
- `footer.copyrightMessage`: optional footer copyright text.
- `footer.buildInfo`: optional footer build timestamp text and date/time
  formatting.
- `github.repo`: the GitHub repository used by deploy and workflow monitoring.
- `github.branch`: the deploy branch.
- `github.pagesWorkflow`: the GitHub Actions workflow name to monitor.
- `deploy.watch`: default poll interval, timeout, and recent-run scan limit for
  `npm run deploy:watch`.

## CLI Commands

The `cli-gallery` binary is the stable command surface for site repositories.
The npm scripts in the starter are thin aliases around these commands.

```sh
cli-gallery doctor
cli-gallery dev:local
cli-gallery config:check
cli-gallery content:check
cli-gallery content:sync
cli-gallery metadata:fix
cli-gallery site:public
cli-gallery images
cli-gallery build
cli-gallery deploy
cli-gallery deploy:watch
```

Use `cli-gallery doctor` to confirm which engine root, site project root, site
directory, Astro output directories, and generated manifest path a command will
use.

Validate project configuration without running a full build:

```sh
npm run config:check
```

`npm run build` runs the same configuration check before content validation,
image generation, and Astro build.

### Navigation

Section links use controlled JavaScript scrolling when
`navigation.smoothScroll.enabled` is `true`. Set it to `false` to jump directly
to the target anchor without animation. The rendered page also uses this value
for native CSS `scroll-behavior`, so the no-JavaScript fallback follows the same
setting.

The smooth-scroll timing values are:

- `minimumDurationMs`: shortest animation duration in milliseconds.
- `maximumDurationMs`: longest animation duration in milliseconds.
- `durationPerPixelMs`: duration added per pixel of scroll distance before the
  minimum/maximum clamp is applied.

Example:

```js
navigation: {
	smoothScroll: {
		enabled: true,
		minimumDurationMs: 2_000,
		maximumDurationMs: 4_000,
		durationPerPixelMs: 0.22,
	},
}
```

### Images

`images.warnOnMissingCopyrightMetadata` controls whether `npm run build` warns
when a referenced source image lacks copyright or creator metadata. The default
is `true`. Builds and deploys do not fail because metadata is missing. Set this
to `false` for a site that deliberately tracks licensing elsewhere.

Example:

```js
images: {
	warnOnMissingCopyrightMetadata: true,
}
```

### Footer

Footer build information is rendered when `footer.buildInfo.enabled` is `true`.
Set it to `false` to hide the build timestamp while keeping the rest of its
configuration in place. The text before the timestamp is configured with
`footer.buildInfo.text`.

The timestamp format uses the standard JavaScript `Intl.DateTimeFormat` fields:
`locale`, `timeZone`, `dateStyle`, and `timeStyle`.

Example:

```js
footer: {
	copyrightMessage: '(c) Example Artist. All rights reserved.',
	buildInfo: {
		enabled: true,
		text: 'Built',
		dateTimeFormat: {
			locale: 'en-GB',
			timeZone: 'Europe/London',
			dateStyle: 'short',
			timeStyle: 'short',
		},
	},
}
```

Omit `footer.copyrightMessage` to hide the copyright sentence. Omit
`footer.buildInfo`, set it to `false`, or set `footer.buildInfo.enabled` to
`false` to hide the build timestamp. If both the copyright sentence and build
timestamp are hidden, the footer is not rendered.

## Content Model

The site is built as one static page. Keep editable site content in
`site/content.md`.

The file uses frontmatter for site-wide data and section configuration:

```yaml
copyrightOwner: Example Artist
defaultPresentation:
  heading:
    align:
      desktop: center
      mobile: center
    size: medium
  body:
    align:
      desktop: center
      mobile: left
    size: medium
sections:
  - id: work
    presentation:
      heading:
        align:
          desktop: left
          mobile: left
        size: large
      body:
        align:
          desktop: left
          mobile: left
    gallery:
      - image: example-work.jpg
        alt: Descriptive alt text.
        caption: Optional caption.
  - id: about
```

Each `sections` entry defines a public section and its optional gallery. The
`id` is the stable technical key used for navigation anchors, image directories,
and Markdown heading ids.

`defaultPresentation` defines heading and running-text defaults for every
section. `sections[].presentation` contains only the values that differ for that
specific section.

Alignment values are validated as `left`, `center`, or `right`. Size values are
validated as `small`, `medium`, `large`, or `xlarge`; the engine maps those names to
responsive CSS font sizes. Override alignment can specify `desktop`, `mobile`,
or both. Defaults must specify both breakpoints.

The default values that match the original CSS are:

```yaml
defaultPresentation:
  heading:
    align:
      desktop: center
      mobile: center
    size: medium
  body:
    align:
      desktop: center
      mobile: left
    size: medium
```

Sites without `defaultPresentation` still use the original
engine defaults: the first section heading is rendered with the large heading
size, later section headings use medium, and body text uses medium.
Centered heading and body text use the engine's narrower text widths. Left- or
right-aligned heading and body text use the same maximum width as gallery
images, so the text block lines up with image edges on desktop while still
collapsing to the available viewport width on mobile.

The visible section title is the Markdown heading. Each top-level site section
must have an explicit heading id matching the frontmatter section id:

```md
## Work {#work}

Introductory text.
```

When adding, renaming, or moving sections, keep these three values aligned:

- The frontmatter section `id`.
- The Markdown heading id, written as `## Section title {#section-id}`.
- The source image directory under `site/images/<section-id>/`.

## Gallery Images

Gallery images are source images under `site/images/<section-id>/`, next to
`site/content.md`.

Reference a gallery image from `site/content.md` with only the filename:

```yaml
gallery:
  - image: example-work.jpg
    alt: Descriptive alt text.
    caption: Optional caption.
```

Rules for source images:

- Use `.jpg`, `.jpeg`, or `.png`.
- Use lowercase, descriptive filenames with ASCII letters, numbers, and hyphens.
- Keep image filenames globally unique under `site/images/`.
- Keep each referenced image in the directory matching the section where it is
  used.
- Only images listed in a section `gallery` are rendered on the site.

Tracked images can remain in the file tree even when they are not currently
referenced from `site/content.md`; `content:check` reports them under
`Unreferenced Images`. New untracked source images should be intentional and
committed before deploy.

If a gallery row is moved to another section in `site/content.md`, run:

```sh
npm run content:sync
```

`content:sync` sorts Markdown sections according to frontmatter and moves
gallery images into matching section directories. It asks before writing files
unless `--yes` is passed by a script.

## Validation And Build

Run a fast content validation pass after content or gallery changes:

```sh
npm run content:check
```

This checks:

- Section order and heading ids.
- Image references in `site/content.md`.
- Duplicate image filenames under `site/images/`.
- Whether referenced images exist.
- Whether gallery images are placed in the expected section directory.
- Images under `site/images/` that are not mounted because they are not
  referenced from `site/content.md`.

Build the site locally with:

```sh
npm run build
```

The build chain runs:

1. `npm run config:check`
2. `npm run content:check`
3. `npm run site:public`
4. `npm run images`
5. Astro build with this package's `astro.config.mjs` and `src/`

The image pipeline generates WebP variants in
`site/.cli-gallery/public/images/generated/`. That directory is local build
preparation output and is not version-controlled. The generated site image
manifest, `site/.cli-gallery/generated-images.json`, stores hashes for source
images and generated variant paths so unchanged images can reuse existing WebP
variants.

The normal generated display widths are 480, 768, 1080, 1440, and 1920 pixels
when the source image is large enough. The pipeline also creates a largest
variant matching the source width when it is larger than the standard display
widths.

Generated WebP filenames include a short hash of the source image, for example
`example-work-1a2b3c4d-1440.webp`. When a source image changes, its generated
image URLs change too, which avoids stale browser, CDN, or GitHub Actions cache
entries at the old URL.

`site:public` copies files from the selected site directory's `public/`
subdirectory into `site/.cli-gallery/public/` before the static build. Files in
the site `public/` directory are source files and should be version-controlled;
copied files under `site/.cli-gallery/public/` are generated build preparation
output.

GitHub Actions caches `site/.cli-gallery/public/images/generated/` between
deploys. With a cache hit and a current
`site/.cli-gallery/generated-images.json`, GitHub can reuse generated WebP
variants; with a cache miss or a changed source-image hash, it rebuilds them
from source images under the selected site `images/` directory.

## Image Metadata

Original source images can be marked with copyright metadata:

```sh
npm run metadata:fix
```

Run this only when new source images should be tagged with the site's copyright
metadata, or when a build warning reveals missing metadata that you want to
write into source files. The script reads `copyrightOwner` from
`site/content.md`, checks source images under `site/images/`, and writes simple
copyright metadata only to images that are missing it.

`npm run build`, `npm run deploy`, and `npm run deploy:commit` do not run
`metadata:fix` and never modify original source images. They also do not create
new copyright metadata in generated image files. If `metadata:fix` updates
source images, commit those updated source files.

## Presentation And Routing

The site is a single static Astro page at `/`. Navigation uses same-page anchor
links:

```text
/#work
/#about
```

The sticky navigation uses real hash links, so the links still work without
JavaScript. With JavaScript enabled, the page intercepts ordinary navigation
clicks and performs a controlled `requestAnimationFrame` scroll when
`navigation.smoothScroll.enabled` is true. It measures the sticky header and
applies the same offset when positioning target headings. Direct hash URLs are
corrected after load if the browser lands in the wrong place.

Gallery images are displayed large on the page, not as thumbnails. Tall images
are constrained with CSS so they fit better in the viewport. The first gallery
image in the first section is prioritized as the likely LCP image; other gallery
images are lazy-loaded. Captions are shown when `caption` is present. Clicking a
gallery image opens the largest generated WebP variant.

## Deploying

In a site repository, use the deploy script as the primary publishing path after
the intended changes have already been committed on the configured deploy
branch:

```sh
npm run deploy
```

The deploy command is generic package code, but the deploy target is
site-specific because it reads `github.*`, `deploy.watch`, and `site.url` from
that site's `site/config.mjs`. The GitHub Pages workflow also belongs in the
site repository.

The deploy script is intentionally conservative. It:

- Requires the current git branch to match `github.branch` in `site/config.mjs`.
- Runs `npm run build`.
- Verifies that the worktree is clean before pushing.
- Pushes when the local deploy branch is ahead of `origin/<branch>`.
- Skips push when the local deploy branch already matches `origin/<branch>`.
- Refuses to deploy when the local deploy branch is behind or has diverged from
  `origin/<branch>`.
- Checks the GitHub Pages workflow configured in `site/config.mjs`.
- Fetches failed logs when the latest Pages run has failed.

The deploy script does not create commits, push uncommitted changes, or run
`npm run metadata:fix`.

The older build-and-commit convenience flow is still available when that is the
desired workflow:

```sh
npm run deploy:commit -- "Describe the change"
```

`deploy:commit` builds, stages only allowed site changes, commits,
pushes the configured deploy branch, and checks GitHub Pages. It does not run
`npm run metadata:fix`.

## Monitoring A Deploy

Use the deploy monitor when you want to follow the GitHub Pages workflow until
it succeeds, fails, or times out:

```sh
npm run deploy:watch
```

The monitor follows the workflow run for the current local `HEAD`, which avoids
mistaking an older workflow run for the result of the latest push. It prints
elapsed time, run id, run URL, status, branch, commit SHA, and the public site
URL.

By default, `deploy:watch` reads the GitHub repository, branch, workflow name,
public site URL, poll interval, timeout, and run scan limit from
`site/config.mjs`. Command-line options can override those defaults for one run.

Common options:

```sh
npm run deploy:watch -- --timeout 20m --interval 5s
npm run deploy:watch -- --help
```

## Troubleshooting And Debugging

Use these commands when diagnosing specific problems. They are not part of the
daily publishing path.

### Project Configuration Errors

Run:

```sh
npm run config:check
```

This validates `site/config.mjs` and reports missing required values, invalid
URLs, invalid booleans or numeric values, and invalid `Intl.DateTimeFormat`
settings before a full build is attempted. Plain JavaScript syntax errors in
`site/config.mjs` are reported as config-check failures with the runtime syntax
message.

### Content Validation Errors

Run:

```sh
npm run content:check
```

Use the grouped report to fix global content problems, section-specific gallery
problems, duplicate image names, missing image files, or misplaced images.

### Static Public File Sync Errors

Run:

```sh
npm run test:site-public
```

This verifies that `site:public` copies static files from the selected site
directory into `site/.cli-gallery/public/`, removes stale copied files, and
keeps generated image output under `site/.cli-gallery/public/images/`.

### Gallery Rows Moved Between Sections

Run:

```sh
npm run content:sync
```

This repairs section ordering and moves referenced image files into the matching
section directory after asking for confirmation.

### Missing Image Metadata

Run:

```sh
npm run metadata:fix
npm run build
```

Commit any source images that `metadata:fix` updated. If a site deliberately
tracks licensing elsewhere, set `images.warnOnMissingCopyrightMetadata` to
`false` in `site/config.mjs`.

### Local Preview Shows Stale Content

Run:

```sh
npm run build:local
```

This performs a full build and restarts the local dev server so Astro reads the
current content and image state.

### Navigation And Anchor Scroll Debugging

Use these commands as debug support when working on sticky navigation, section
anchors, anchor offsets, or smooth scrolling:

- `npm run test:navigation`: baseline navigation diagnostic after changing
  sticky navigation, anchor offsets, or scroll behavior.
- `npm run test:navigation:stress`: repeated navigation diagnostic for
  intermittent anchor-positioning races, especially cases where a click
  sometimes stops at the wrong section.
- `npm run test:navigation:preview`: production-like diagnostic that builds the
  site, serves `dist/` through Astro preview, and tests sticky-navigation
  anchors against the generated output.

Increase the repeated navigation runs when needed:

```sh
NAVIGATION_STRESS_RUNS=100 npm run test:navigation:stress
NAVIGATION_PREVIEW_ROUNDS=10 npm run test:navigation:preview
```

If Playwright reports a missing browser, run:

```sh
npx playwright install chromium
```

## Command Reference

### Setup

```sh
npm install
npx playwright install chromium
```

For an installed site repository, the npm scripts call `cli-gallery`. The
commands can also be run directly with `npx cli-gallery ...`.

### Local Preview

```sh
npm run dev:local
npm run dev:status
npm run dev:logs
npm run dev:logs -- --follow
npm run dev:restart
npm run dev:stop
```

### Content, Config, And Images

```sh
npm run config:check
npm run content:check
npm run content:sync
npm run metadata:fix
npm run site:public
npm run images
```

### Build

```sh
npm run build
npm run build:local
```

### Deploy

```sh
npm run deploy
npm run deploy -- --help
npm run deploy:commit -- "Describe the change"
npm run deploy:commit -- --help
npm run deploy:watch
npm run deploy:watch -- --help
```

### Diagnostics

```sh
npm run test:content-check
npm run test:site-public
npm run test:fixture:build
npm run package:check
npm run test:navigation
npm run test:navigation:stress
npm run test:navigation:preview
```

`test:content-check` is a standalone regression test for `content:check` and
`content:sync` behavior against temporary fixtures. `test:fixture:build` builds
the committed fixture site. `package:check` verifies that a packed
`@janga/cli-gallery` package works from a separate starter-based site project.

## File Map

There is no standalone `MANIFEST` file. This section is the current file map for
the reusable project structure.

```text
README.md                          # Reusable project model and workflow
AGENTS.md                          # Additional instructions for coding agents
bin/
`-- cli-gallery.mjs                 # CLI entrypoint for installed site repos
site/                               # Local dog-gallery demo for this repo
|-- config.mjs                      # Demo technical project config
|-- content.md                      # Demo sections, captions, and image refs
|-- .cli-gallery/generated-images.json # Demo generated image manifest
|-- .cli-gallery/public/            # Demo generated publicDir, not version-controlled
|-- images/dogs/                    # Demo source images
`-- public/                         # Demo static public files
starters/basic/                     # Copyable starter for new site repos
|-- .github/workflows/deploy.yml     # Site-owned GitHub Pages workflow
|-- package.json                    # Site package depending on cli-gallery
`-- site/                           # Starter site files
fixtures/basic/site/                # Minimal fixture for engine checks
src/
|-- layouts/BaseLayout.astro        # Shared HTML shell and metadata
|-- pages/index.astro               # Renders the single page from configured content.md
|-- styles/global.css               # Layout, sticky navigation, responsive design
`-- content.config.ts               # Validates configured content.md
scripts/
|-- build-site.mjs                  # Build orchestrator used by the CLI
|-- check-config.mjs                # Project config validation
|-- deploy-site.mjs                 # Conservative local deploy command
|-- doctor.mjs                      # Prints resolved engine/site paths
|-- watch-pages-deploy.mjs          # GitHub Pages workflow monitor
|-- sync-content-sections.mjs       # Content validation and sync
|-- sync-site-public.mjs            # Copies configured public/ into Astro public output
|-- test-content-check.mjs          # Content validation regression tests
|-- test-package-check.mjs          # Packed-package integration test
|-- test-site-public.mjs            # Static public file sync regression tests
|-- generate-images.mjs             # WebP generation pipeline
`-- fix-image-metadata.mjs          # Source image metadata helper
tests/                              # Playwright navigation regression tests
```

## GitHub Pages Deployment Model

GitHub Pages should use GitHub Actions as its source. The Pages workflow belongs
in each site repository, because the deploy target, domain files, branch, and
repository settings are site-specific. A site workflow should install Node and
the image tools, restore the generated image cache, run `npm ci`, run
`npm run build`, upload the generated `dist/` artifact, and publish it to
GitHub Pages. The generated image cache key should include
`site/.cli-gallery/generated-images.json` for the selected site directory.

Site-specific static files such as `site/public/CNAME`,
`site/public/robots.txt`, and `site/public/sitemap.xml` should live in the site
repository together with `site/config.mjs`.
