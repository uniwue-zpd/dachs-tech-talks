import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (!session.user) {
        return []
    }

    const response = await $fetch('https://api.github.com/user/orgs', {
        headers: {
            Authorization: `token ${session.user.accessToken}`,
        },
    })

    return response.map((org: { login: string }) => org.login)
})
