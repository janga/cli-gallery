# Getting Started

This guide creates a new site repository from the included starter. It describes
the generic `cli-gallery` setup; site-specific content belongs in the new site
repository.

## Requirements

- Node.js `>=22.12.0`
- ImageMagick for image generation
- GitHub CLI (`gh`) for deploy checks and deploy monitoring

Install Playwright Chromium only when you plan to run navigation diagnostics:

```sh
npx playwright install chromium
```

## Create A Site Repository

Create a site from the starter:

```sh
npx @janga/cli-gallery@latest init ../my-gallery
cd ../my-gallery
npm install
npm run dev:local
```

The starter contains:

- `package.json` with npm scripts that call `cli-gallery`
- `.github/workflows/deploy.yml` for GitHub Pages
- `site/config.mjs`
- `site/content.md`
- `site/images/work/.gitkeep`
- `site/public/robots.txt`

Commit the generated `package-lock.json` after the first install.

## First Edits

1. Edit `site/config.mjs` for the site's URL, GitHub repository, footer, and
   deploy settings.
2. Edit `site/content.md` for title, description, sections, text, gallery rows,
   alt text, and captions.
3. Put source images under `site/images/<section-id>/`.
4. Put static files such as `robots.txt`, `CNAME`, and favicons under
   `site/public/`.
5. Run:

```sh
npm run config:check
npm run content:check
npm run build
```

Read [Site Structure](site-structure.md), [Content](content.md), and
[Configuration](configuration.md) before publishing a real site.
