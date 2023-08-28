export const schema = gql`
  type Category {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String!
    channel: Channel!
    channelId: Int!
    imageUrl: String
  }

  type PagedCategories {
    data: [Category!]!
    hasNext: Boolean!
  }

  input CategoriesWhereInput {
    channelId: Int!
  }
  input CategoriesOrderByInput {
    id: SortOrder
  }
  type Query {
    categories(
      page: Int
      pageSize: Int
      orderBy: CategoriesOrderByInput
      where: CategoriesWhereInput!
    ): PagedCategories! @requireAuth
    category(id: Int!): Category @requireAuth
  }

  input CreateCategoryInput {
    title: String!
    channelId: Int!
    imageUrl: String
  }

  input UpdateCategoryInput {
    title: String
    imageUrl: String
  }

  type Mutation {
    createCategory(input: CreateCategoryInput!): Category! @requireAuth
    updateCategory(id: Int!, input: UpdateCategoryInput!): Category!
      @requireAuth
    deleteCategory(id: Int!): Category! @requireAuth
  }
`
