export default defineOAuthGitHubEventHandler({
    config: {
        scope: ['read:user', 'read:org'],
    },
    async onSuccess(event, { user }) {
        await setUserSession(event, { user })
        return sendRedirect(event, '/')
    }
})