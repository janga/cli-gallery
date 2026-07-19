import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { pathToFileURL } from 'node:url';
import { z } from 'astro/zod';
import { siteDir, siteDirLabel } from '../scripts/lib/site-paths.mjs';

const siteEntryId = `${siteDirLabel
	.replace(/^[./\\]+/, '')
	.replace(/[^a-zA-Z0-9-]+/g, '-')
	.replace(/^-+|-+$/g, '') || 'site'}-content`;
const contentImageName = z.string().regex(/^[a-z0-9][a-z0-9.-]*\.(jpe?g|png)$/i);
const cssNumber = String.raw`(?:0|[1-9]\d*)(?:\.\d+)?`;
const cssLength = String.raw`${cssNumber}(?:rem|em|px|vw|vh|vmin|vmax|%)`;
const cssLengthExpression = String.raw`${cssLength}(?:\s*[+-]\s*${cssLength})?`;
const cssFontSize = z.string().regex(
	new RegExp(String.raw`^(?:${cssLength}|clamp\(\s*${cssLengthExpression}\s*,\s*${cssLengthExpression}\s*,\s*${cssLengthExpression}\s*\))$`),
	'Use a CSS font-size length or clamp(...) expression with rem, em, px, %, or viewport units.',
);
const textAlign = z.enum(['left', 'center', 'right']);
const responsiveTextAlign = z.object({
	desktop: textAlign,
	mobile: textAlign,
}).strict();
const responsiveFontSize = z.object({
	desktop: cssFontSize,
	mobile: cssFontSize,
}).strict();
const textPresentation = z.object({
	align: responsiveTextAlign.optional(),
	fontSize: responsiveFontSize.optional(),
}).strict();

const galleryImage = z.object({
	image: contentImageName,
	alt: z.string(),
	caption: z.string().optional(),
});

const site = defineCollection({
	loader: glob({
		pattern: 'content.md',
		base: pathToFileURL(siteDir),
		generateId: () => siteEntryId,
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		copyrightOwner: z.string().min(1),
		sections: z.array(
			z.object({
				id: z.string().regex(/^[a-z0-9-]+$/),
				heading: textPresentation.optional(),
				body: textPresentation.optional(),
				gallery: z.array(galleryImage).optional().default([]),
			}).strict(),
		).min(1),
	}),
});

export const collections = { site };
