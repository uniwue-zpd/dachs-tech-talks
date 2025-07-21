const UPVOTED_PROPOSALS_KEY = 'dachs_upvoted_proposals'

export function useUpvotes() {
    const upvotedSlugs = ref<Set<string>>(new Set())

    onMounted(() => {
        const stored = localStorage.getItem(UPVOTED_PROPOSALS_KEY)
        if (stored) {
            upvotedSlugs.value = new Set(JSON.parse(stored))
        }
    })

    const hasUpvoted = (slug: string) => {
        return upvotedSlugs.value.has(slug)
    }

    const addUpvote = (slug: string) => {
        upvotedSlugs.value.add(slug)
        localStorage.setItem(UPVOTED_PROPOSALS_KEY, JSON.stringify(Array.from(upvotedSlugs.value)))
    }

    return {
        hasUpvoted,
        addUpvote,
    }
}
