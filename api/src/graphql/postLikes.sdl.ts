export const schema = gql`
  type PostLike {
    id: Int!
    user: User!
    userId: Int!
    post: Post!
    postId: Int!
  }

  type PagedPostLikes {
    hasNext: Boolean
    data: [PostLike!]!
  }

  type Query {
    postLikes: PagedPostLikes! @requireAuth
    myPostLikes: PagedPostLikes! @requireAuth
    postLike(id: Int!): PostLike @requireAuth
  }

  input LikePostInput {
    postId: Int!
  }

  type Mutation {
    likePost(input: LikePostInput!): PostLike! @requireAuth
    dislikePost(postId: Int!): PostLike! @requireAuth
  }
`
