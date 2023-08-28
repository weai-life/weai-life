export const schema = gql`
  type PostBlock {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    block: Block!
    blockId: Int!
    post: Post!
    postId: Int!
    position: Int!
  }

  type Query {
    # postBlocks: [PostBlock!]!
    postBlock(id: Int!): PostBlock @requireAuth
  }

  input CreatePostBlockInput {
    blockId: Int!
    postId: Int!
    position: Int
  }

  input UpdatePostBlockInput {
    blockId: Int
    postId: Int
    position: Int
  }

  input positionPostBlocksInput {
    ids: [ID!]!
  }

  type Mutation {
    createPostBlock(input: CreatePostBlockInput!): PostBlock! @requireAuth
    updatePostBlock(id: Int!, input: UpdatePostBlockInput!): PostBlock!
      @requireAuth
    positionPostBlocks(postId: Int!, input: positionPostBlocksInput!): Boolean!
      @requireAuth
    deletePostBlock(id: Int!): PostBlock! @requireAuth
  }
`
