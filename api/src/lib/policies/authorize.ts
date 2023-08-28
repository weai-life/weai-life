import { User } from '@prisma/client'
import { context } from '@redwoodjs/graphql-server'

type AuthorizeFunction = (
  user: User | null | undefined
) => (a?: unknown, b?: unknown) => Promise<boolean>
export const _authorize = (fn: AuthorizeFunction) => fn(context.currentUser)
const _skipAuth = () => async () => true

// skip auth when in test
export const authorize =
  process.env.NODE_ENV === 'test' ? _skipAuth : _authorize
