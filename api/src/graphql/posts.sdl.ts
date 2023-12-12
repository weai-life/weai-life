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
    applet: Applet
    appletId: Int
    accessType: AccessType!
    isDraft: Boolean
    publishedAt: DateTime
    happenedAt: DateTime
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
    todo: Todo
    externalId: String
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

  input PostsWhereInput {
    authorId: Int
    channelId: Int
    appletId: Int
    categoryId: Int
    title: StringFilter
    content: StringFilter
    schema: StringFilter
    isDraft: Boolean
    todo: TodosWhereInput
    externalId: StringFilter
  }

  input PostsOrderByInput {
    id: SortOrder
    channelId: Int
    appletId: Int
    categoryId: Int
    updatedAt: SortOrder
    happenedAt: SortOrder
    todo: TodosOrderByInput
  }

  type Query {
    publicPosts(
      page: Int
      pageSize: Int
      where: PostsWhereInput
      orderBy: PostsOrderByInput
    ): PagedPosts! @skipAuth
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
  }

  input CreatePostInput {
    appletId: Int!
    title: String!
    content: String
    schema: String
    channelId: Int
    categoryId: Int
    isDraft: Boolean
    store: JSON
    happenedAt: DateTime
    blocks: [CreateBlockInput!]
    todo: CreatePostTodoInput
    externalId: String
  }

  input CreatePostTodoInput {
    deadline: DateTime
    assignees: [Int!]
    timerAt: DateTime
  }

  input UpdatePostInput {
    title: String
    content: String
    schema: String
    channelId: Int
    accessType: AccessType
    categoryId: Int
    isDraft: Boolean
    store: JSON
    happenedAt: DateTime
    externalId: String
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post! @requireAuth
    updatePost(id: Int!, input: UpdatePostInput!): Post! @requireAuth
    deletePost(id: Int!): Post! @requireAuth
  }
`
