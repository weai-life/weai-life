export const schema = gql`
  type Page {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    slug: String!
    active: Boolean!
    channel: Channel!
    channelId: Int!
    template: Template
    templateId: Int
  }

  type PagedPages {
    data: [Page!]!
    hasNext: Boolean!
  }

  type Query {
    pages(
      page: Int
      pageSize: Int
      where: PagesWhereInput
      orderBy: PagesOrderByInput
    ): PagedPages! @requireAuth
    page(id: Int!): Page @requireAuth
    activePage(slug: String!): Page @skipAuth
  }

  input PagesWhereInput {
    channelId: Int
    slug: StringFilter
  }

  input PagesOrderByInput {
    id: SortOrder
    channelId: Int
    slug: SortOrder
  }

  input CreatePageInput {
    channelId: Int!
    slug: String!
    active: Boolean
    templateId: Int
  }

  input UpdatePageInput {
    slug: String
    active: Boolean
    templateId: Int
  }

  type Mutation {
    createPage(input: CreatePageInput!): Page! @requireAuth
    updatePage(id: Int!, input: UpdatePageInput!): Page! @requireAuth
    deletePage(id: Int!): Page! @requireAuth
  }
`
