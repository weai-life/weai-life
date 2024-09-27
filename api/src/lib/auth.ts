import { parseJWT, Decoded } from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { logger } from './logger'

/**
 * Represents the user attributes returned by the decoding the
 * Authentication provider's JWT together with an optional list of roles.
 */
type RedwoodUser = Record<string, unknown>

/**
 * getCurrentUser returns the user information together with
 * an optional collection of roles used by requireAuth() to check
 * if the user is authenticated or has role-based access
 *
 * !! BEWARE !! Anything returned from this function will be available to the
 * client--it becomes the content of `currentUser` on the web side (as well as
 * `context.currentUser` on the api side). You should carefully add additional
 * fields to the return object only once you've decided they are safe to be seen
 * if someone were to open the Web Inspector in their browser.
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 *
 * @param decoded - The decoded access token containing user info and JWT
 *   claims like `sub`. Note, this could be null.
 * @param { token, SupportedAuthTypes type } - The access token itself as well
 *   as the auth provider type
 * @param { APIGatewayEvent event, Context context } - An optional object which
 *   contains information from the invoker such as headers and cookies, and the
 *   context information about the invocation such as IP Address
 * @returns RedwoodUser
 */
export const getCurrentUser = async (): Promise<RedwoodUser | null> => {
  return context.currentUser
}

/**
 * The user is authenticated if there is a currentUser in the context
 *
 * @returns {boolean} - If the currentUser is authenticated
 */
export const isAuthenticated = (): boolean => {
  logger.trace('authorize currentUser: %o', context.currentUser)

  return !!context.currentUser
}

/**
 * Use requireAuth in your services to check that a user is logged in,
 * whether or not they are assigned a role, and optionally raise an
 * error if they're not.
 *
 * @param roles?: {@link AllowedRoles} - When checking role membership, these roles grant access.
 *
 * @returns - If the currentUser is authenticated (and assigned one of the given roles)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} - If the currentUser is not allowed due to role permissions
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const requireAuth = () => {
  logger.trace('requireAuth called')

  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  return true
}
