export const schema = gql`
  input SendSesCodeInput {
    email: String!
  }

  type SendSesCodePayload {
    status: SendSesCodeStatus!
    message: String!
  }

  enum SendSesCodeStatus {
    SENT
    ERROR
    MAX_TIMES
    NOT_EXPIRED
  }

  type Mutation {
    sendSesCode(input: SendSesCodeInput!): SendSesCodePayload @skipAuth
  }
`
