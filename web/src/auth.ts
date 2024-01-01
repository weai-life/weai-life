import { createAuthentication } from '@redwoodjs/auth'

// If you're integrating with an auth service provider you should delete this interface.
// Instead you should import the type from their auth client sdk.
export interface AuthClient {
  login: () => User
  logout: () => void
  signup: () => User
  getToken: () => string
  getUserMetadata: () => Promise<User> | null
}

// If you're integrating with an auth service provider you should delete this interface.
// This type should be inferred from the general interface above.
interface User {
  // The name of the id variable will vary depending on what auth service
  // provider you're integrating with. Another common name is `sub`
  id: number
  name: string
  email: string
}

// If you're integrating with an auth service provider you should delete this interface
// This type should be inferred from the general interface above
export interface ValidateResetTokenResponse {
  error?: string
  [key: string]: string | undefined
}

const QUERY_PROFILE = `
  query profile {
    profile {
      id
      name
      email
      avatarUrl
    }
  }
`

const getUserMetadata: () => Promise<User> = async () => {
  const response = await fetch(`${window.RWJS_API_GRAPHQL_URL}`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      Authorization: `Bear ${localStorage.getItem('TOKEN')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ operationName: 'profile', query: QUERY_PROFILE }),
  })

  const userData = await response.json()
  return userData.data.profile
}

// Replace this with the auth service provider client sdk
const client = {
  login: () => ({
    id: 1,
    name: 'email@example.com',
    email: 'email@example.com',
  }),
  signup: () => ({
    id: 1,
    name: 'email@example.com',
    email: 'email@example.com',
  }),
  logout: () => {},
  getToken: () => {
    return localStorage.getItem('TOKEN') ?? 'UNDEFINED'
  },
  getUserMetadata: getUserMetadata,
}

function createAuth() {
  const authImplementation = createAuthImplementation(client)

  // You can pass custom provider hooks here if you need to as a second
  // argument. See the Redwood framework source code for how that's used
  return createAuthentication(authImplementation)
}

// This is where most of the integration work will take place. You should keep
// the shape of this object (i.e. keep all the key names) but change all the
// values/functions to use methods from the auth service provider client sdk
// you're integrating with
function createAuthImplementation(client: AuthClient) {
  return {
    type: 'custom-auth',
    client,
    login: async () => client.login(),
    logout: async () => client.logout(),
    signup: async () => client.signup(),
    getToken: async () => client.getToken(),
    /**
     * Actual user metadata might look something like this
     * {
     *   "id": "11111111-2222-3333-4444-5555555555555",
     *   "aud": "authenticated",
     *   "role": "authenticated",
     *   "roles": ["admin"],
     *   "email": "email@example.com",
     *   "app_metadata": {
     *     "provider": "email"
     *   },
     *   "user_metadata": null,
     *   "created_at": "2016-05-15T19:53:12.368652374-07:00",
     *   "updated_at": "2016-05-15T19:53:12.368652374-07:00"
     * }
     */
    getUserMetadata: async () => client.getUserMetadata(),
  }
}

export const { AuthProvider, useAuth } = createAuth()
