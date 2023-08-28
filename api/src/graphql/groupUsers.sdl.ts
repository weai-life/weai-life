export const schema = gql`
  type GroupUser {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    group: Group!
    groupId: Int!
    user: User!
    userId: Int!
    status: GroupUserStatus!
  }

  type PagedGroupUsers {
    data: [GroupUser!]!
    hasNext: Boolean!
  }

  enum GroupUserStatus {
    PENDING
    JOINED
  }

  type Query {
    groupUsers(
      page: Int
      where: GroupUserWhereInput
      orderBy: GroupUsersOrderByInput
    ): PagedGroupUsers @requireAuth
    #   groupUser(id: Int!): GroupUser @requireAuth
  }

  input GroupUsersOrderByInput {
    id: SortOrder
  }

  input GroupUserWhereInput {
    groupId: Int!
    """
    默认 JOINED 状态
    """
    status: GroupUserStatus
  }

  input UpdateGroupUserInput {
    status: GroupUserStatus
  }
  type Mutation {
    quitGroup(id: Int!): GroupUser! @requireAuth
    updateGroupUser(id: Int!, input: UpdateGroupUserInput!): GroupUser!
      @requireAuth
    deleteGroupUser(id: Int!): GroupUser! @requireAuth
  }
`
