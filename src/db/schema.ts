import { pgTable, uuid, varchar, pgEnum, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { title } from "node:process";

export const rolesEnum = pgEnum('roles',
    ["admin", "user"]
)

export const users = pgTable('users', {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    role: rolesEnum('role').notNull().default("user"),
}, (t) => ({
    userIndex: uniqueIndex("user_index").on(t.email)
}))

export const refreshTokens = pgTable('refresh_tokens', {
    id: uuid('id').primaryKey().defaultRandom(),
    tokenHash: varchar('token_hash', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (t) => ({
    tokenIndex: uniqueIndex("token_index").on(t.tokenHash),
    userTokenIndex: index("user_token_index").on(t.userId)
}))

export const blogPosts = pgTable('blog_posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 1000 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    imageUrl: varchar("image_url", { length: 500 }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
}, (t) => ({
    userIndex: index("blog_user_index").on(t.userId)
}))