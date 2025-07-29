import { ref, onMounted } from 'vue'

const UPVOTED_PROPOSALS_KEY = 'dachs_upvoted_proposals'
const USER_ORGS_KEY = 'dachs_user_orgs'

export function useUpvotes() {
    const upvotedSlugs = ref<Set<string>>(new Set())
    const userOrgs = ref<string[]>([])
    const isOrgMember = ref(false)
    const { loggedIn } = useUserSession()

    onMounted(async () => {
        const stored = localStorage.getItem(UPVOTED_PROPOSALS_KEY)
        if (stored) {
            upvotedSlugs.value = new Set(JSON.parse(stored))
        }

        if (loggedIn.value) {
            const storedOrgs = sessionStorage.getItem(USER_ORGS_KEY)
            if (storedOrgs) {
                userOrgs.value = JSON.parse(storedOrgs)
            } else {
                userOrgs.value = await $fetch('/api/auth/github/orgs')
                sessionStorage.setItem(USER_ORGS_KEY, JSON.stringify(userOrgs.value))
            }
            isOrgMember.value = userOrgs.value.includes('uniwue-zpd')
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
        isOrgMember,
    }
}
