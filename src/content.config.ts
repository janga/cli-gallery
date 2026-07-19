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
	heading: overrideTextPresentation.optional(),
	body: overrideTextPresentation.optional(),
}).strict();
const sitePresentation = z.object({
	default: z.object({
		heading: defaultTextPresentation,
		body: defaultTextPresentation,
	}).strict(),
	sections: z.record(
		z.string().regex(/^[a-z0-9-]+$/),
		sectionPresentationOverride,
	).optional().default({}),
}).strict();

const galleryImage = z.object({
	image: contentImageName,
	alt: z.string(),
	caption: z.string().optional(),
});

const siteSchema = z.object({
	title: z.string(),
	description: z.string(),
	copyrightOwner: z.string().min(1),
	presentation: sitePresentation.optional(),
	sections: z.array(
		z.object({
			id: z.string().regex(/^[a-z0-9-]+$/),
			gallery: z.array(galleryImage).optional().default([]),
		}).strict(),
	).min(1),
}).superRefine((data, context) => {
	const sectionIds = new Set(data.sections.map((section) => section.id));
	const presentationSections = data.presentation?.sections ?? {};

	for (const sectionId of Object.keys(presentationSections)) {
		if (sectionIds.has(sectionId)) {
			continue;
		}

		context.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['presentation', 'sections', sectionId],
			message: `Presentation override uses unknown section id "${sectionId}".`,
		});
	}
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
