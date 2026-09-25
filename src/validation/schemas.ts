import { file, z } from 'zod'

export const loginSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    password: z.string().min(8, 'Password must be 8 characters or more')
})

export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    email: z.email("Invalid email").min(1, 'Email is required').max(100),
    password: z.string().min(8, 'Password must be 8 characters or more')
})

export type loginSchemaBody = z.infer<typeof loginSchema>
export type registerSchemaBody = z.infer<typeof registerSchema>