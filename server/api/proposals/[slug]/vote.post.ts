import { defineEventHandler, getRouterParam, createError } from 'h3'

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

    const { database } = hubDatabase()

    // Create tables if they don't exist
    await database.exec(`
        CREATE TABLE IF NOT EXISTS votes (
            proposal_slug TEXT PRIMARY KEY,
            vote_count INTEGER DEFAULT 0
        )
    `)

    await database.exec(`
        CREATE TABLE IF NOT EXISTS user_votes (
            username TEXT,
            proposal_slug TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (username, proposal_slug)
        )
    `)

    // Check if user has already voted for this proposal
    const existingVote = await database.prepare('SELECT 1 FROM user_votes WHERE username = ? AND proposal_slug = ?')
        .bind(session.user.login, slug)
        .first()

    if (existingVote) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Already voted',
        })
    }

    // Insert user vote
    await database.prepare('INSERT INTO user_votes (username, proposal_slug) VALUES (?, ?)')
        .bind(session.user.login, slug)
        .run()

    // Update vote count
    await database.prepare(`
        INSERT INTO votes (proposal_slug, vote_count) VALUES (?, 1)
        ON CONFLICT(proposal_slug) DO UPDATE SET vote_count = vote_count + 1
    `)
        .bind(slug)
        .run()

    // Get current vote count
    const result = await database.prepare('SELECT vote_count FROM votes WHERE proposal_slug = ?')
        .bind(slug)
        .first()

    return { slug, votes: result?.vote_count || 1 }
})