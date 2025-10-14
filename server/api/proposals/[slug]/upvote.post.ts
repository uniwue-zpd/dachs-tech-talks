export default eventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session.user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    const { slug } = getRouterParams(event)
    const db = useDrizzle()
    const githubId = String(session.user.id)
    const githubLogin = String(session.user.login)

    const existingUpvote = await db.select().from(tables.upvotes)
        .where(and(
            eq(tables.upvotes.githubId, githubId),
            eq(tables.upvotes.proposalSlug, slug)
        ))
        .get()

    if (existingUpvote) {
        await db.delete(tables.upvotes)
            .where(and(
                eq(tables.upvotes.githubId, githubId),
                eq(tables.upvotes.proposalSlug, slug)
            ))

        return { upvoted: false }
    } else {
        await db.insert(tables.upvotes).values({
            githubId,
            githubLogin: githubLogin,
            proposalSlug: slug,
            createdAt: new Date()
        })

        return { upvoted: true }
    }
})