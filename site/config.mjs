const siteUrl = 'http://localhost:4321/';

export default {
	site: {
		// Public canonical URL for this site.
		url: siteUrl,
	},
	gallery: {
		// Maximum rendered gallery width for landscape images and aligned text.
		width: '900px',
	},
	typography: {
		// CSS font-family stack used by the whole site, including sticky navigation.
		fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
	},
	navigation: {
		smoothScroll: {
			// Set to false to make section links jump directly to the target anchor.
			enabled: true,

			// Minimum and maximum animation time for controlled anchor navigation.
			minimumDurationMs: 2_000,
			maximumDurationMs: 4_000,

			// Additional duration per pixel of scroll distance, before min/max clamping.
			durationPerPixelMs: 0.22,
		},
	},
	footer: {
		// Omit this value to hide the copyright sentence.
		copyrightMessage: 'Dog images from Wikimedia Commons; see image captions for license details.',

		// Set enabled to false to hide the build timestamp while keeping its config.
		buildInfo: {
			enabled: true,

			// Text shown before the formatted build timestamp.
			text: 'Built',

			// Standard Intl.DateTimeFormat options for the build timestamp.
			dateTimeFormat: {
				locale: 'en-GB',
				timeZone: 'UTC',
				dateStyle: 'short',
				timeStyle: 'short',
			},
		},
	},
	github: {
		// Example repository and workflow details used by deploy scripts.
		repo: 'owner/example-gallery',
		branch: 'main',
		pagesWorkflow: 'Deploy to GitHub Pages',
	},
	deploy: {
		watch: {
			// Defaults for npm run deploy:watch.
			intervalMs: 10_000,
			timeoutMs: 15 * 60_000,
			runLimit: 10,
		},
	},
};
