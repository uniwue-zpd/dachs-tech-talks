import { defineEventHandler, getRouterParam, createError } from 'h3'
import { useStorage } from 'nitropack/runtime'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)
    if (!session.user || !session.user.login) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        })
    }

    // Check if the user is a member of the required organization
    const orgs = await $fetch('/api/auth/github/orgs', {
        headers: {
            cookie: event.req.headers.cookie || '',
        },
    })

    if (!orgs.includes('uniwue-zpd')) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden: You must be a member of the uniwue-zpd organization to vote.',
        })
    }

    const slug = getRouterParam(event, 'slug')
    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Proposal slug is required',
        })
    }

    const storage = useStorage('data:votes')
    const userVotesKey = `user_votes:${session.user.login}`

    const userVotes = (await storage.getItem<string[]>(userVotesKey)) || []

    if (userVotes.includes(slug)) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Already voted',
        })
    }

    const currentVotes = (await storage.getItem<number>(slug)) || 0
    const newVotes = currentVotes + 1
    await storage.setItem(slug, newVotes)

    userVotes.push(slug)
    await storage.setItem(userVotesKey, userVotes)

    return { slug, votes: newVotes }
})
