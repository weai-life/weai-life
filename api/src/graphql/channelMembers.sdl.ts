export const schema = gql`
  type ChannelMember {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    channel: Channel!
    channelId: Int!
    user: User!
    userId: Int!
    status: MemberStatus!
    source: ChannelMemberSource!
    unreadPostCount: Int!
    isAdmin: Boolean!
    shareable: Boolean!
    inviteable: Boolean!
  }

  type PagedChannelMembers {
    data: [ChannelMember!]!
    hasNext: Boolean!
  }

  enum MemberStatus {
    PENDING
    JOINED
  }

  type Query {
    channelMembers(
      page: Int
      where: ChannelMemberWhereInput
      orderBy: ChannelMembersOrderByInput
    ): PagedChannelMembers @requireAuth
    #   channelMember(id: Int!): ChannelMember
  }

  input ChannelMembersOrderByInput {
    id: SortOrder
  }

  input ChannelMemberWhereInput {
    channelId: Int!
    """
    默认 JOINED 状态
    """
    status: MemberStatus
    source: ChannelMemberSource
  }

  enum ChannelMemberSource {
    """
    邀请加入
    """
    Invited
    """
    管理员拉入
    """
    Pulled
    """
    小组成员
    """
    GroupMember
  }

  input CreateChannelMemberInput {
    channelId: Int!
    userId: Int!
    status: MemberStatus!
    isAdmin: Boolean
    shareable: Boolean
    inviteable: Boolean
  }

  input UpdateChannelMemberInput {
    channelId: Int
    userId: Int
    status: MemberStatus
    isAdmin: Boolean
    shareable: Boolean
    inviteable: Boolean
  }

  type Mutation {
    # createChannelMember(input: CreateChannelMemberInput!): ChannelMember!
    # updateChannelMember(
    #   id: Int!
    #   input: UpdateChannelMemberInput!
    # ): ChannelMember!
    # deleteChannelMember(id: Int!): ChannelMember!
    joinChannel(id: Int!): ChannelMember! @requireAuth
    joinChannelByCode(inviteCode: String!): ChannelMember! @requireAuth
    quitChannel(id: Int!): ChannelMember! @requireAuth
  }
`
