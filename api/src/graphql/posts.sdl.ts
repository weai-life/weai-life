export const schema = gql`
  type Post {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String!
    content: String
    schema: String
    author: User!
    authorId: Int!
    channel: Channel
    channelId: Int
    tool: Tool
    toolId: Int
    accessType: AccessType!
    isDraft: Boolean
    archived: Boolean
    publishedAt: DateTime
    sequenceAt: DateTime
    likesCount: Int!
    commentsCount: Int!
    comments: [Comment]!
    topComments: [Comment]!
    liked: Boolean!
    category: Category
    categoryId: Int
    store: JSON!
    accessToken: String!
    postBlocks: [PostBlock!]!
    externalId: String
    tags: [PostTag]
    collaborators: [Collaborator]
  }

  enum AccessType {
    PRIVATE
    PUBLIC
    PAID
  }

  type PagedPosts {
    data: [Post!]!
    hasNext: Boolean!
  }

  input TagIdInput {
    tagId: IntFilter
  }

  input IntListFilter {
    every: TagIdInput
    some: TagIdInput
    none: TagIdInput
  }

  input CollaboratorUserIdInput {
    userId: IntFilter
  }

  input CollaboratorIdListFilter {
    every: CollaboratorUserIdInput
    some: CollaboratorUserIdInput
    none: CollaboratorUserIdInput
  }

  input PostsWhereInput {
    authorId: Int
    channelId: Int
    toolId: Int
    categoryId: Int
    title: StringFilter
    content: StringFilter
    schema: StringFilter
    isDraft: Boolean
    archived: Boolean
    externalId: StringFilter
    tags: IntListFilter
    collaborators: CollaboratorIdListFilter
  }

  input PostsOrderByInput {
    id: SortOrder
    channelId: Int
    toolId: Int
    categoryId: Int
    updatedAt: SortOrder
    sequenceAt: SortOrder
  }

  type Query {
    publicPosts(
      page: Int
      pageSize: Int
      where: PostsWhereInput
      orderBy: PostsOrderByInput
    ): PagedPosts! @skipAuth
    channelPosts(
      page: Int
      pageSize: Int
      where: PostsWhereInput
      orderBy: PostsOrderByInput
    ): PagedPosts! @requireAuth
    posts(
      page: Int
      pageSize: Int
      where: PostsWhereInput
      orderBy: PostsOrderByInput
    ): PagedPosts! @requireAuth
    post(id: Int!, accessToken: String): Post @skipAuth
    myPosts(
      page: Int
      pageSize: Int
      where: PostsWhereInput
      orderBy: PostsOrderByInput
    ): PagedPosts! @requireAuth
    userPublicPosts(
      page: Int
      pageSize: Int
      where: PostsWhereInput
      orderBy: PostsOrderByInput
    ): PagedPosts! @requireAuth
  }

  input CreatePostInput {
    toolId: Int!
    title: String!
    content: String
    schema: String
    channelId: Int
    categoryId: Int
    isDraft: Boolean
    store: JSON
    sequenceAt: DateTime
    blocks: [CreateBlockInput!]
    externalId: String
  }

  input UpdatePostInput {
    title: String
    content: String
    schema: String
    channelId: Int
    accessType: AccessType
    categoryId: Int
    isDraft: Boolean
    archived: Boolean
    store: JSON
    sequenceAt: DateTime
    externalId: String
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post! @requireAuth
    updatePost(id: Int!, input: UpdatePostInput!): Post! @requireAuth
    deletePost(id: Int!): Post! @requireAuth
  }
`
