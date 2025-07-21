import { defineEventHandler } from 'h3'
import { useStorage } from 'nitropack/runtime'

export default defineEventHandler(async () => {
    const storage = useStorage('data:votes')

    const keys = await storage.getKeys()

    const voteItems = await Promise.all(
        keys.map(key => storage.getItem(key).then(value => ({ [key]: value || 0 })))
    )

    return Object.assign({}, ...voteItems)
})
