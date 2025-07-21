import { defineEventHandler, getRouterParam } from 'h3'
import { useStorage } from 'nitropack/runtime'

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')
    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Proposal slug is required',
        })
    }

    const storage = useStorage('data:votes')

    const currentVotes = await storage.getItem<number>(slug) || 0
    const newVotes = currentVotes + 1

    await storage.setItem(slug, newVotes)

    return { slug, votes: newVotes }
})
