import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        talks: defineCollection({
            source: 'talks/**/*.md',
            type: 'page',
                schema: z.object({
                    title: z.string(),
                    speaker: z.string(),
                    category: z.string(),
                    tags: z.array(z.string()),
                    date: z.date(),
                    time: z.string().optional(),
                    location: z.string().optional(),
                    deep_dive: z.boolean().optional(),
                })
        }),
        proposals: defineCollection({
            source: 'proposals/**/*.md',
            type: 'page',
            schema: z.object({
                title: z.string(),
                tags: z.array(z.string()),
            })
        })
    }
})
