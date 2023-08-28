import { RedwoodGraphQLError } from '@redwoodjs/graphql-server'

export class NotFoundError extends RedwoodGraphQLError {
  constructor(message: string) {
    super(message, { code: 'NOT_FOUND' })
  }
}
