export const schema = gql`
  type PostTag {
    id: Int!
    post: Post!
    postId: Int!
    tag: Tag!
    tagId: Int!
  }

  type Query {
    postTags: [PostTag!]! @requireAuth
    postTag(id: Int!): PostTag @requireAuth
  }

  input CreatePostTagInput {
    postId: Int!
    tagId: Int!
  }

  input UpdatePostTagInput {
    postId: Int
    tagId: Int
  }

  type Mutation {
    createPostTag(input: CreatePostTagInput!): PostTag! @requireAuth
    updatePostTag(id: Int!, input: UpdatePostTagInput!): PostTag! @requireAuth
    deletePostTag(id: Int!): PostTag! @requireAuth
  }
`
