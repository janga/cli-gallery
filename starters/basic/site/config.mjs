export default {
	site: {
		url: 'https://example.com/',
	},
	typography: {
		fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
	},
	navigation: {
		smoothScroll: {
			enabled: true,
			minimumDurationMs: 600,
			maximumDurationMs: 1_200,
			durationPerPixelMs: 0.2,
		},
	},
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
	},
	github: {
		repo: 'owner/example-gallery',
		branch: 'main',
		pagesWorkflow: 'Deploy to GitHub Pages',
	},
};
