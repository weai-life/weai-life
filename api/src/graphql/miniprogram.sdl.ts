export const schema = gql`
  input MpSignInInput {
    groupId: Int!
    code: String!
  }

  input MpSignInBySmsCodeInput {
    groupId: Int!
    code: String!
    mobile: String!
    smsCode: String!
    nickname: String!
    avatarUrl: String!
    gender: Int
    country: String
    province: String
    city: String
    language: String
  }

  input MpSignUp {
    groupId: Int!
    code: String!
    phoneCode: String!
    nickname: String!
    avatarUrl: String!
    gender: Int
    country: String
    province: String
    city: String
    language: String
  }

  type Mutation {
    """
    用微信登录code登录
    """
    mpSignIn(input: MpSignInInput!): AuthPayload @skipAuth
    """
    用短信验证手机号自动登录，没有用户时自动注册用户
    """
    mpSignInBySmsCode(input: MpSignInBySmsCodeInput!): AuthPayload @skipAuth
    """
    用授权手机号code绑定微信用户
    """
    mpSignUp(input: MpSignUp!): AuthPayload @skipAuth
    cacheMpUserAvatar(userId: Int!): User @requireAuth
  }
`
