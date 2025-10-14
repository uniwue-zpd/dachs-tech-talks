export default eventHandler(async (event) => {
    const { slug } = getRouterParams(event)
    const session = await getUserSession(event)
    const db = useDrizzle()

    const upvotes = await db.select().from(tables.upvotes)
        .where(eq(tables.upvotes.proposalSlug, slug))
        .all()

    let hasUpvoted = false
    if (session.user) {
        const githubId = String(session.user.id)
        hasUpvoted = upvotes.some(u => u.githubId === githubId)
    }

    return {
        count: upvotes.length,
        hasUpvoted
    }
})