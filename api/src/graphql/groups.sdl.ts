export const schema = gql`
  type Group {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    owner: User!
    ownerId: Int!
    name: String!
    description: String
    avatarUrl: String
    groupUsers(page: Int, pageSize: Int): PagedGroupUsers
    groupUserCount: Int!
    unreadPostCount: Int!
    isGroupUser: Boolean!
    store: JSON!
    public: Boolean!
  }

  type PagedGroups {
    data: [Group!]!
    hasNext: Boolean!
  }

  type Query {
    groups(
      page: Int
      pageSize: Int
      where: GroupsWhereInput
      orderBy: GroupsOrderByInput
    ): PagedGroups @requireAuth
    publicGroups(
      page: Int
      pageSize: Int
      where: PublicGroupsWhereInput
      orderBy: GroupsOrderByInput
    ): PagedGroups @skipAuth
    myOwnedGroups(
      page: Int
      pageSize: Int
      where: GroupsWhereInput
      orderBy: GroupsOrderByInput
    ): PagedGroups @requireAuth
    group(id: Int!): Group @skipAuth
    myJoinedGroups(
      page: Int
      pageSize: Int
      where: GroupsWhereInput
      orderBy: GroupsOrderByInput
    ): PagedGroups! @requireAuth
  }

  input GroupsWhereInput {
    name: StringFilter
    public: BooleanFilter
  }

  input PublicGroupsWhereInput {
    name: StringFilter
  }

  input GroupsOrderByInput {
    id: IntFilter
  }

  input CreateGroupInput {
    name: String!
    description: String
    avatarUrl: String
    store: JSON
    public: Boolean
  }

  input UpdateGroupInput {
    name: String
    description: String
    avatarUrl: String
    store: JSON
    public: Boolean
  }

  type Mutation {
    createGroup(input: CreateGroupInput!): Group! @requireAuth
    updateGroup(id: Int!, input: UpdateGroupInput!): Group! @requireAuth
    deleteGroup(id: Int!): Group! @requireAuth

    """
    邀请用户到小组，用户必须要先注册才能成功
    """
    pullUserToGroup(mobile: String!, groupId: Int!): GroupUser! @requireAuth
    joinGroupByCode(inviteCode: String!): GroupUser! @requireAuth
    joinPublicGroup(groupId: Int!): GroupUser! @requireAuth
    quitGroup(id: Int!): GroupUser! @requireAuth
    clearGroupUnreadPostCount(groupId: Int!): GroupUser @requireAuth
    searchUserByMobile(groupId: Int!, mobile: String!): User @requireAuth
  }
`
