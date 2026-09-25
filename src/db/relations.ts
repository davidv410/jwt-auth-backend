import { defineRelations } from 'drizzle-orm'
import * as schema from './schema.js'

export const relations = defineRelations(schema, (r) => ({
  users: {
    blogPosts: r.many.blogPosts(),
  },
  blogPosts: {
    user: r.one.users({
      from: r.blogPosts.userId,
      to: r.users.id,
    }),
  },
}))