export default {
	site: {
		url: 'https://example.com/',
	},
	navigation: {
		smoothScroll: {
			enabled: true,
			minimumDurationMs: 600,
			maximumDurationMs: 1_200,
			durationPerPixelMs: 0.2,
		},
	},
	images: {
		warnOnMissingCopyrightMetadata: true,
	},
	footer: {
		copyrightMessage: '(c) Fixture Artist.',
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
	},
	github: {
		repo: 'owner/fixture-gallery',
		branch: 'main',
		pagesWorkflow: 'Deploy to GitHub Pages',
	},
};
