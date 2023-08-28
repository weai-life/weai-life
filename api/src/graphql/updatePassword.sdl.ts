export const schema = gql`
  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input ResetPasswordInput {
    mobile: String!
    password: String!
    smsCode: String!
  }

  type UpdatePasswordPayload {
    status: UpdatePasswordStatus!
    message: String!
  }

  enum UpdatePasswordStatus {
    SUCCESS
    FAILED
  }

  type Mutation {
    changePassword(input: ChangePasswordInput!): UpdatePasswordPayload
      @requireAuth
    resetPassword(input: ResetPasswordInput!): UpdatePasswordPayload @skipAuth
  }
`
