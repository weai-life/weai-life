export const schema = gql`
  input SignInByPasswordInput {
    mobile: String!
    password: String!
    clientInfo: ClientInfo
  }

  input SignInBySmsInput {
    mobile: String!
    smsCode: String!
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

  type InvitePayload {
    code: String!
  }

  type Mutation {
    signInByPassword(input: SignInByPasswordInput!): AuthPayload @skipAuth
    signInBySms(input: SignInBySmsInput!): AuthPayload @skipAuth
    refreshToken: AuthPayload @requireAuth
  }
`
