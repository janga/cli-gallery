# Configuration

Technical site configuration lives in the selected site's `config.mjs`; by
default that is `site/config.mjs`. The file must default-export an object.

This document describes the generic configuration interface. It does not list
the current values for any one site.

## Site

### `site.url`

- Purpose: canonical public URL used in the page `<link rel="canonical">`,
  deploy monitoring output, and site-specific documentation.
- Type: string.
- Required: yes.
- Default: none.
- Validation: non-empty absolute URL accepted by `new URL()`.
- Consequence: wrong values render a wrong canonical URL and make deploy output
  point at the wrong site.

Example:

```js
site: {
	url: 'https://example.com/',
}
```

## Gallery

### `gallery.width`

- Purpose: maximum rendered width for gallery images, gallery captions, and
  left- or right-aligned section text that is intended to line up with gallery
  edges.
- Type: string containing a simple positive CSS length.
- Required: no.
- Default: `900px`.
- Validation: if set, it must be a positive number followed by one of `px`,
  `rem`, `em`, `vw`, `vh`, `vmin`, `vmax`, `ch`, or `%`.
- Consequence: the value overrides the global `--gallery-width` CSS variable.
  Landscape images fill this width. Portrait images keep their proportions and
  may render narrower because they are constrained by image height.

Example:

```js
gallery: {
	width: '900px',
}
```

## Typography

### `typography.fontFamily`

- Purpose: global CSS `font-family` stack used by site text and sticky
  navigation.
- Type: string containing a CSS font-family value.
- Required: no.
- Default: `Arial, 'Helvetica Neue', Helvetica, sans-serif`, matching the
  engine's existing sticky-navigation font stack.
- Validation: if set, it must be a non-empty string and must not contain
  semicolons, braces, or line breaks.
- Consequence: the value overrides the global `--font-sans` CSS variable for
  the whole page. Section headings, body text, gallery captions, footer text,
  and sticky navigation all inherit from that variable unless engine CSS gives a
  more specific rule.

Example:

```js
typography: {
	fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}
```

## Navigation

### `navigation.smoothScroll`

- Purpose: controls enhanced same-page anchor navigation and native
  `scroll-behavior`.
- Type: object.
- Required: no; omitted fields use defaults.

Fields:

- `navigation.smoothScroll.enabled`: boolean, default `true`.
- `navigation.smoothScroll.minimumDurationMs`: positive integer, default
  `2000`.
- `navigation.smoothScroll.maximumDurationMs`: positive integer, default
  `4000`; must be greater than or equal to `minimumDurationMs`.
- `navigation.smoothScroll.durationPerPixelMs`: positive number, default
  `0.22`.

When `enabled` is `false`, section links jump directly to anchors without the
controlled animation. The no-JavaScript fallback keeps real `href="#section-id"`
links.

Example:

```js
navigation: {
	smoothScroll: {
		enabled: true,
		minimumDurationMs: 600,
		maximumDurationMs: 1_200,
		durationPerPixelMs: 0.2,
	},
}
```

## Footer

### `footer.copyrightMessage`

- Purpose: optional footer sentence.
- Type: string.
- Required: no.
- Default: hidden.
- Validation: if set, it must be a non-empty string. `undefined`, `null`, and
  `''` are treated as absent.
- Consequence: footer rendering is enabled when this or enabled build info is
  present.

### `footer.buildInfo`

- Purpose: optional footer build timestamp.
- Type: object, `false`, `null`, or omitted.
- Required: no.
- Default: hidden.
- Validation: object fields are validated when the object is present. `false`,
  `null`, or omission hides build info.

Fields:

- `footer.buildInfo.enabled`: boolean, default `true`.
- `footer.buildInfo.text`: required non-empty string.
- `footer.buildInfo.dateTimeFormat`: required object.
- `footer.buildInfo.dateTimeFormat.locale`: required string.
- `footer.buildInfo.dateTimeFormat.timeZone`: required string.
- `footer.buildInfo.dateTimeFormat.dateStyle`: required string.
- `footer.buildInfo.dateTimeFormat.timeStyle`: required string.

The date/time object must be accepted by `Intl.DateTimeFormat`.

Example:

```js
footer: {
	copyrightMessage: '(c) Example Artist.',
	buildInfo: {
		enabled: true,
		text: 'Built',
		dateTimeFormat: {
			locale: 'en-GB',
			timeZone: 'UTC',
			dateStyle: 'short',
			timeStyle: 'short',
		},
	},
}
```

If both `footer.copyrightMessage` and enabled `footer.buildInfo` are absent, the
footer is not rendered.

## GitHub

### `github.repo`

- Purpose: repository used by deploy checks and deploy monitoring.
- Type: string in `owner/name` form.
- Required: yes.
- Default: none.
- Validation: non-empty string.

### `github.branch`

- Purpose: deploy branch required by `cli-gallery deploy` and monitored by
  `deploy:watch`.
- Type: string.
- Required: yes.
- Default: none.
- Validation: non-empty string.

### `github.pagesWorkflow`

- Purpose: GitHub Actions workflow name used by deploy checks and
  `deploy:watch`.
- Type: string.
- Required: yes.
- Default: none.
- Validation: non-empty string.

## Deploy Watch

### `deploy.watch`

- Purpose: defaults for `cli-gallery deploy:watch`.
- Type: object.
- Required: no; omitted fields use defaults.

Fields:

- `deploy.watch.intervalMs`: positive integer, default `10000`.
- `deploy.watch.timeoutMs`: positive integer, default `900000`.
- `deploy.watch.runLimit`: positive integer, default `10`.

Command-line options such as `--interval`, `--timeout`, and `--limit` can
override these values for one run.

## Site Directory Selection

The site directory is not configured in `config.mjs`.

Use one of:

```sh
CLI_GALLERY_SITE_DIR=my-site npm run build
cli-gallery --site-dir my-site build
```

If `CLI_GALLERY_SITE_DIR` is set to an empty value, commands fail. Relative site
directories are resolved by walking upward from the invocation root until the
selected directory contains `config.mjs` and `content.md`. Absolute site
directories are accepted and make their parent the site project root.
