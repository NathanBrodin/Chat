import { defineCollection, defineConfig, s } from "velite"

const about = defineCollection({
  name: "About",
  pattern: "about/**/*.mdx",
  schema: s.object({
    slug: s.slug("about"),
    title: s.string().max(99),
    description: s.string(),
    content: s.mdx(),
    metadata: s.metadata(),
    excerpt: s.excerpt(),
  }),
})

const awards = defineCollection({
  name: "Award",
  pattern: "awards/**/*.mdx",
  schema: s.object({
    slug: s.slug("awards"),
    title: s.string().max(99),
    description: s.string(),
    date: s.string(),
    content: s.mdx(),
    metadata: s.metadata(),
    excerpt: s.excerpt(),
  }),
})

const certifications = defineCollection({
  name: "Certification",
  pattern: "certifications/**/*.mdx",
  schema: s.object({
    slug: s.slug("certifications"),
    title: s.string().max(99),
    description: s.string(),
    date: s.string(),
    institution: s.string(),
    website: s.string().url().optional(),
    skills: s.array(s.string()),
    content: s.mdx(),
    metadata: s.metadata(),
    excerpt: s.excerpt(),
  }),
})

const educations = defineCollection({
  name: "Education",
  pattern: "educations/**/*.mdx",
  schema: s.object({
    slug: s.slug("educations"),
    title: s.string().max(99),
    description: s.string(),
    location: s.string(),
    date: s.string(),
    institution: s.string(),
    website: s.string().url().optional(),
    skills: s.array(s.string()),
    grade: s.string(),
    content: s.mdx(),
    metadata: s.metadata(),
    excerpt: s.excerpt(),
  }),
})

const experiences = defineCollection({
  name: "Experience",
  pattern: "experiences/**/*.mdx",
  schema: s.object({
    slug: s.slug("experiences"),
    title: s.string().max(99),
    description: s.string(),
    date: s.string(),
    company: s.string(),
    website: s.string().url().optional(),
    position: s.string(),
    location: s.string(),
    skills: s.array(s.string()),
    content: s.mdx(),
    metadata: s.metadata(),
    excerpt: s.excerpt(),
  }),
})

const languages = defineCollection({
  name: "Language",
  pattern: "languages/**/*.mdx",
  schema: s.object({
    slug: s.slug("languages"),
    title: s.string().max(99),
    description: s.string(),
    content: s.mdx(),
    metadata: s.metadata(),
    excerpt: s.excerpt(),
  }),
})

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s.object({
    slug: s.slug("projects"),
    title: s.string().max(99),
    description: s.string(),
    date: s.string(),
    repository: s.string().url().optional(),
    website: s.string().url().optional(),
    content: s.mdx(),
    metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
    excerpt: s.excerpt(), // excerpt of markdown content
  }),
})

const recommendations = defineCollection({
  name: "Recommendation",
  pattern: "recommendations/**/*.mdx",
  schema: s.object({
    slug: s.slug("recommendations"),
    title: s.string().max(99),
    description: s.string(),
    author: s.string(),
    role: s.string(),
    relation: s.string(),
    link: s.string().url(),
    date: s.string(),
    content: s.mdx(),
    metadata: s.metadata(),
    excerpt: s.excerpt(),
  }),
})

const volunteerings = defineCollection({
  name: "Volunteering",
  pattern: "volunteerings/**/*.mdx",
  schema: s.object({
    slug: s.slug("volunteerings"),
    title: s.string().max(99),
    description: s.string(),
    date: s.string(),
    organization: s.string(),
    content: s.mdx(),
    metadata: s.metadata(),
    excerpt: s.excerpt(),
  }),
})

export default defineConfig({
  collections: {
    about,
    awards,
    certifications,
    educations,
    experiences,
    languages,
    projects,
    recommendations,
    volunteerings,
  },
})
