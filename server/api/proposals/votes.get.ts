import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
    const { database } = hubDatabase()

    await database.exec(`
        CREATE TABLE IF NOT EXISTS votes (
            proposal_slug TEXT PRIMARY KEY,
            vote_count INTEGER DEFAULT 0
        )
    `)

    const results = await database.prepare('SELECT proposal_slug, vote_count FROM votes').all()

    const votes: Record<string, number> = {}
    results.forEach(row => {
        votes[row.proposal_slug] = row.vote_count
    })

    return votes
})