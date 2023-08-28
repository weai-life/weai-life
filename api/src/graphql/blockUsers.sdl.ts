export const schema = gql`
  type BlockUser {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
    user: User!
    blockedUserId: Int!
    blockedUser: User!
  }

  type PagedBlockUsers {
    data: [BlockUser!]!
    hasNext: Boolean!
  }

  input BlockUsersWhereInput {
    userId: Int
  }

  input BlockUsersOrderByInput {
    id: SortOrder
  }

  type Query {
    blockUsers(
      page: Int
      pageSize: Int
      orderBy: BlockUsersOrderByInput
      where: BlockUsersWhereInput
    ): PagedBlockUsers! @requireAuth
    myBlockUsers(
      page: Int
      pageSize: Int
      orderBy: BlockUsersOrderByInput
    ): PagedBlockUsers! @requireAuth
    blockUser(id: Int!): BlockUser @requireAuth
  }

  input CreateBlockUserInput {
    blockedUserId: Int!
  }

  # input UpdateBlockUserInput {
  #   userId: Int
  #   blockedUserId: Int
  # }

  type Mutation {
    createBlockUser(input: CreateBlockUserInput!): BlockUser! @requireAuth
    # updateBlockUser(id: Int!, input: UpdateBlockUserInput!): BlockUser! @requireAuth
    deleteBlockUser(id: Int!): BlockUser! @requireAuth
  }
`
