export const schema = gql`
  type Block {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    userId: Int!
    content: JSON!
    contentType: BlockContentType!
    searchText: String
    postBlocks: [PostBlock]!
  }

  enum BlockContentType {
    Text
    Image
    File
    Link
  }

  type PagedBlocks {
    data: [Block!]!
    hasNext: Boolean!
  }

  type Query {
    blocks(
      page: Int
      pageSize: Int
      where: BlocksWhereInput
      orderBy: BlocksOrderByInput
    ): PagedBlocks @requireAuth
    myBlocks(
      page: Int
      pageSize: Int
      where: BlocksWhereInput
      orderBy: BlocksOrderByInput
    ): PagedBlocks @requireAuth
    block(id: Int!): Block @requireAuth
  }

  input BlocksWhereInput {
    contentType: StringFilter
    searchText: StringFilter
  }

  input BlocksOrderByInput {
    id: IntFilter
  }

  input CreateBlockInput {
    content: JSON!
    contentType: BlockContentType!
    searchText: String
  }

  input UpdateBlockInput {
    content: JSON
    contentType: String
    searchText: String
  }

  type Mutation {
    createBlock(input: CreateBlockInput!): Block! @requireAuth
    updateBlock(id: Int!, input: UpdateBlockInput!): Block! @requireAuth
    deleteBlock(id: Int!): Block! @requireAuth
  }
`
