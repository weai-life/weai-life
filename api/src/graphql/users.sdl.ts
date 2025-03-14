export const schema = gql`
  type User {
    id: Int!
    email: String!
    name: String!
    avatarUrl: String
    createdAt: DateTime!
    updatedAt: DateTime!
    isAdmin: Boolean!
    store: JSON!
    channelMembers(page: Int, status: MemberStatus): PagedChannelMembers!
    posts(
      page: Int
      pageSize: Int
      where: PostsWhereInput
      orderBy: PostsOrderByInput
    ): PagedPosts!
    ownedChannels(page: Int): PagedChannels!
    # joinedChannels(page: Int): PagedChannels!
    postCount: Int!
    joinedGroupCount: Int!
    joinedChannelCount: Int!
  }

  type PagedUsers {
    hasNext: Boolean
    data: [User!]!
  }

  type People {
    name: String
    avatarUrl: String
    isConnected: Boolean
    tools: [Tool!]!
  }

  type Query {
    """
    所有用户列表，仅限管理员使用
    """
    users(page: Int): PagedUsers! @requireAuth

    """
    返回个人信息
    """
    profile: User! @requireAuth

    people(id: Int!): People! @skipAuth
  }

  input UpdateProfileInput {
    name: String!
    avatarUrl: String
    store: JSON
  }

  type Mutation {
    updateProfile(input: UpdateProfileInput!): User @requireAuth
  }
`
