export const schema = gql`
  input SendSmsCodeInput {
    mobile: String!
  }

  type SendSmsCodePayload {
    status: SendSmsCodeStatus!
    message: String!
  }

  enum SendSmsCodeStatus {
    SENT
    ERROR
    MAX_TIMES
    NOT_EXPIRED
  }

  type Mutation {
    sendSmsCode(input: SendSmsCodeInput!): SendSmsCodePayload @skipAuth
  }
`
