export default eventHandler(async (event) => {
    const { slug } = getRouterParams(event)
    const db = useDrizzle()

    const upvoters = await db.select({
        githubLogin: tables.upvotes.githubLogin
    })
        .from(tables.upvotes)
        .where(eq(tables.upvotes.proposalSlug, slug))
        .all()

    return Array.from(new Set(upvoters.map(u => u.githubLogin)))
})
