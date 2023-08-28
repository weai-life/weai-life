export const schema = gql`
  input SignUpInput {
    mobile: String!
    "密码长度 8 ~ 40"
    password: String!
    name: String
    smsCode: String!
    inviteCode: String!
    clientInfo: ClientInfo
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthPayload @skipAuth
  }
`
