import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'

export const upvotes = sqliteTable('upvotes', {
    githubId: text('github_id').notNull(),
    githubLogin: text('github_login').notNull(),
    proposalSlug: text('proposal_slug').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.githubId, table.proposalSlug] })
}))