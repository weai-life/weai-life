export const schema = gql`
  type Channel {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String!
    description: String
    layout: Layout!
    author: User!
    authorId: Int!
    avatarUrl: String
    lastPostAt: DateTime
    posts(
      page: Int
      pageSize: Int
      where: PostsWhereInput
      orderBy: PostsOrderByInput
    ): PagedPosts!
    channelMembers(page: Int, pageSize: Int): PagedChannelMembers!
    categories(page: Int, pageSize: Int): PagedCategories!
    unreadPostCount: Int!
    postCount: Int!
    memberCount: Int!
    isPublic: Boolean!
    page: Page
    group: Group
    groupId: Int
    kind: ChannelKind!
    template: Template
    templateId: Int
    isChannelMember: Boolean!
    config: JSON!
  }

  enum Layout {
    DEFAULT
    IMAGE
    VIDEO
    MIX
  }

  enum ChannelKind {
    """
    通用频道 默认值
    """
    general
    """
    说明文档
    """
    documentation
    """
    文件投递频道
    """
    file
    """
    时间线
    """
    timeline
    """
    讨论
    """
    discuss
    """
    博客
    """
    blog
    """
    课程
    """
    course
    """
    newsletter
    """
    newsletter
    """
    todo
    """
    todo
    """
    link
    """
    link
    """
    page
    """
    page
    """
    group
    """
    group
  }

  type PagedChannels {
    data: [Channel!]!
    hasNext: Boolean!
  }

  type Query {
    publicChannels(
      page: Int
      pageSize: Int
      where: ChannelsWhereInput
      orderBy: ChannelsOrderByInput
    ): PagedChannels @skipAuth
    channels(
      page: Int
      pageSize: Int
      where: ChannelsWhereInput
      orderBy: ChannelsOrderByInput
    ): PagedChannels @requireAuth
    channel(id: Int!): Channel @skipAuth
    myOwnedChannels(
      page: Int
      pageSize: Int
      where: ChannelsWhereInput
      orderBy: ChannelsOrderByInput
    ): PagedChannels! @requireAuth
    myJoinedChannels(
      page: Int
      pageSize: Int
      where: ChannelsWhereInput
      orderBy: ChannelsOrderByInput
    ): PagedChannels! @requireAuth
  }
  input ChannelsWhereInput {
    kind: StringFilter
    title: StringFilter
    templateId: IntFilter
  }

  input ChannelsOrderByInput {
    id: SortOrder
    lastPostAt: SortOrder
  }

  input CreateChannelInput {
    title: String!
    description: String
    avatarUrl: String
    layout: Layout
    isPublic: Boolean
    groupId: Int
    kind: ChannelKind
    templateId: Int
    config: JSON
  }

  input UpdateChannelInput {
    title: String
    description: String
    avatarUrl: String
    layout: Layout
    isPublic: Boolean
    groupId: Int
    kind: ChannelKind
    templateId: Int
    config: JSON
  }

  type QuitChannelResult {
    success: Boolean!
  }

  type Mutation {
    createChannel(input: CreateChannelInput!): Channel! @requireAuth
    updateChannel(id: Int!, input: UpdateChannelInput!): Channel! @requireAuth
    deleteChannel(id: Int!): Channel! @requireAuth
    clearUnreadPostCount(channelId: Int!): ChannelMember @requireAuth

    """
    邀请用户到自己的频道，用户必须要先注册才能成功
    """
    pullUserToChannel(mobile: String!, channelId: Int!): ChannelMember!
      @requireAuth

    transferChannel(channelId: Int!, userId: Int!): Channel! @requireAuth
  }
`
