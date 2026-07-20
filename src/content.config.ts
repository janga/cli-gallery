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
const colorValue = z.string().regex(
	/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
	'Use a hex color such as "#000000".',
);
const textAlign = z.enum(['left', 'center', 'right']);
const textSize = z.enum(['small', 'medium', 'large', 'xlarge']);
const defaultResponsiveTextAlign = z.object({
	desktop: textAlign,
	mobile: textAlign,
}).strict();
const overrideResponsiveTextAlign = z.object({
	desktop: textAlign.optional(),
	mobile: textAlign.optional(),
}).strict().refine(
	(value) => value.desktop !== undefined || value.mobile !== undefined,
	'Specify desktop, mobile, or both.',
);
const defaultTextPresentation = z.object({
	align: defaultResponsiveTextAlign,
	size: textSize,
}).strict();
const overrideTextPresentation = z.object({
	align: overrideResponsiveTextAlign.optional(),
	size: textSize.optional(),
}).strict();
const sectionPresentationOverride = z.object({
	backgroundColor: colorValue.optional(),
	textColor: colorValue.optional(),
	heading: overrideTextPresentation.optional(),
	body: overrideTextPresentation.optional(),
}).strict();
const defaultPresentation = z.object({
	backgroundColor: colorValue.optional(),
	textColor: colorValue.optional(),
	heading: defaultTextPresentation,
	body: defaultTextPresentation,
}).strict();

const galleryImage = z.object({
	image: contentImageName,
	alt: z.string(),
	caption: z.string().optional(),
});

const siteSchema = z.object({
	title: z.string(),
	description: z.string(),
	defaultPresentation: defaultPresentation.optional(),
	sections: z.array(
		z.object({
			id: z.string().regex(/^[a-z0-9-]+$/),
			presentation: sectionPresentationOverride.optional(),
			gallery: z.array(galleryImage).optional().default([]),
		}).strict(),
	).min(1),
});

const site = defineCollection({
	loader: glob({
		pattern: 'content.md',
		base: pathToFileURL(siteDir),
		generateId: () => siteEntryId,
	}),
	schema: siteSchema,
});

export const collections = { site };
