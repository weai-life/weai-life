export const schema = gql`
  type Comment {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    content: String!
    contentType: String
    author: User!
    authorId: Int!
    post: Post!
    postId: Int!
    """
    帖子的评论，回复链的第一层，当自身就是第一层时，该值为空
    """
    comment: Comment!
    """
    帖子的评论ID，回复链的第一层，当自身就是第一层时，该值为空
    """
    commentId: Int
    """
    当自身就是第一层时，可以得到所有的回复
    """
    comments(
      page: Int
      pageSize: Int
      orderBy: CommentsOrderByInput
    ): PagedComments!
    """
    回复数
    """
    commentsCount: Int!
    """
    回复对象ID
    """
    repliedCommentId: Int
    """
    回复对象
    """
    repliedComment: Comment
  }

  type PagedComments {
    data: [Comment!]!
    hasNext: Boolean!
  }

  input CommentsWhereInput {
    postId: Int
    commentId: Int
    content: StringFilter
  }

  input CommentsOrderByInput {
    id: SortOrder
  }

  type Query {
    comments(
      page: Int
      pageSize: Int
      where: CommentsWhereInput
      orderBy: CommentsOrderByInput
    ): PagedComments! @skipAuth
    myComments(
      page: Int
      pageSize: Int
      where: CommentsWhereInput
      orderBy: CommentsOrderByInput
    ): PagedComments! @requireAuth
    comment(id: Int!): Comment @skipAuth
  }

  input CreateCommentInput {
    content: String!
    contentType: String
    postId: Int!
    repliedCommentId: Int
  }

  input UpdateCommentInput {
    content: String
    contentType: String
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment! @requireAuth
    updateComment(id: Int!, input: UpdateCommentInput!): Comment! @requireAuth
    deleteComment(id: Int!): Comment! @requireAuth
  }
`
