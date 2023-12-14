export const schema = gql`
  input SignInBySesInput {
    email: String!
    sesCode: String!
    clientInfo: ClientInfo
  }

  input ClientInfo {
    version: String!
    os: OS
    platform: Platform
    jpush: JPushInfo
  }

  input JPushInfo {
    registrationId: String!
  }

  enum OS {
    Android
    iOS
  }

  enum Platform {
    app
    web
    miniapp
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    signInBySes(input: SignInBySesInput!): AuthPayload @skipAuth
    refreshToken: AuthPayload @requireAuth
  }
`
