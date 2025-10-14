export default eventHandler(async (event) => {
    const session = await getUserSession(event)
    const db = useDrizzle()

    const allUpvotes = await db.select().from(tables.upvotes).all()

    const stats: Record<string, { count: number; hasUpvoted: boolean }> = {}

    allUpvotes.forEach(upvote => {
        if (!stats[upvote.proposalSlug]) {
            stats[upvote.proposalSlug] = {
                count: 0,
                hasUpvoted: false
            }
        }

        stats[upvote.proposalSlug].count++

        if (session.user && upvote.githubId === String(session.user?.id)) {
            stats[upvote.proposalSlug].hasUpvoted = true
        }
    })

    return stats
})