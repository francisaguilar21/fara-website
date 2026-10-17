import { z } from 'zod'

// Schemas for the typed data files in `content/` (P4-R2). The MDX collections (`posts`,
// `projects`, `pages`) are validated by Velite instead, see `velite.config.ts`.
//
// Every entry supports `draft?: boolean`. A draft is a placeholder: it renders with `<DraftChip />`
// until the real content replaces it (Phase 5 policy).
const draft = z.boolean().optional()

/** `YYYY-MM` */
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected YYYY-MM')

/** `h:mm:ss`, for example `1:45:30` */
const duration = z.string().regex(/^\d{1,2}:[0-5]\d:[0-5]\d$/, 'Expected h:mm:ss')

const url = z.url()

export const ExperienceSchema = z
  .object({
    role: z.string().min(1),
    org: z.string().min(1),
    orgUrl: url.optional(),
    start: month,
    /** Empty (or missing) means the role is current. */
    end: z.union([month, z.literal('')]).optional(),
    location: z.string().optional(),
    kind: z.enum(['work', 'life']),
    summary: z.string().min(1),
    highlights: z.array(z.string()),
    tags: z.array(z.string()),
    featured: z.boolean(),
    draft,
  })
  .refine((entry) => !entry.end || entry.end >= entry.start, {
    message: 'end must not be before start',
    path: ['end'],
  })

export const CertificationSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  year: z.number().int().min(1990).max(2100),
  credentialUrl: url.optional(),
  draft,
})

export const RecommendationSchema = z.object({
  quote: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  relationship: z.string().min(1),
  avatar: z.string().optional(),
  linkedinUrl: url.optional(),
  draft,
})

export const RaceSchema = z.object({
  name: z.string().min(1),
  /** `YYYY-MM-DD` */
  date: z.iso.date(),
  distanceKm: z.number().positive(),
  time: duration,
  pr: z.boolean(),
  role: z.enum(['runner', 'pacer']),
  resultsUrl: url.optional(),
  draft,
})

export const TalkSchema = z.object({
  title: z.string().min(1),
  event: z.string().min(1),
  /** `YYYY-MM-DD` */
  date: z.iso.date(),
  location: z.string().optional(),
  slidesUrl: url.optional(),
  videoUrl: url.optional(),
  draft,
})

export const GalleryImageSchema = z.object({
  /** Path under `public/`, for example `/static/images/gallery/finish-line.webp`. */
  src: z.string().startsWith('/'),
  alt: z.string().min(10, 'Describe the photo: alt text needs at least 10 characters'),
  caption: z.string().optional(),
  /** `YYYY-MM-DD` */
  date: z.iso.date().optional(),
  tag: z.enum(['race', 'travel', 'event', 'life']),
  draft,
})

export const UsesGroupSchema = z.object({
  category: z.string().min(1),
  items: z.array(
    z.object({
      name: z.string().min(1),
      note: z.string().optional(),
      url: url.optional(),
    })
  ),
  draft,
})

export const SiteSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  headline: z.string().min(1),
  intro: z.string().min(1),
  location: z.string().min(1),
  socials: z.array(z.object({ label: z.string().min(1), url })),
  /** A full URL, or a path under `public/` such as `/static/resume.pdf`. */
  resumeUrl: z
    .union([url, z.string().regex(/^\/[^/]\S*$/, 'Expected a URL or a /path')])
    .optional(),
  email: z.email().optional(),
  draft,
})

export type Experience = z.infer<typeof ExperienceSchema>
export type Certification = z.infer<typeof CertificationSchema>
export type Recommendation = z.infer<typeof RecommendationSchema>
export type Race = z.infer<typeof RaceSchema>
export type Talk = z.infer<typeof TalkSchema>
export type GalleryImage = z.infer<typeof GalleryImageSchema>
export type UsesGroup = z.infer<typeof UsesGroupSchema>
export type Site = z.infer<typeof SiteSchema>
