export const schema = gql`
  type Template {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    title: String!
    description: String
    pages: PagedPages!
    userId: Int!
    user: User!
    uploadInfo: UploadInfo!
    kind: TemplateKind!
    config: JSON!
  }

  enum TemplateKind {
    """
    页面模板 （默认值）
    """
    Page
    """
    频道模板
    """
    Channel
  }

  type PagedTemplates {
    data: [Template!]!
    hasNext: Boolean!
  }

  type Query {
    templates(
      page: Int
      pageSize: Int
      where: TemplatesWhereInput
      orderBy: TemplatesOrderByInput
    ): PagedTemplates! @skipAuth
    myTemplates(
      page: Int
      pageSize: Int
      where: TemplatesWhereInput
      orderBy: TemplatesOrderByInput
    ): PagedTemplates! @requireAuth
    template(id: Int!): Template @skipAuth
  }

  input TemplatesWhereInput {
    name: StringFilter
    title: StringFilter
    kind: StringFilter
    userId: IntFilter
  }

  input TemplatesOrderByInput {
    id: SortOrder
    name: SortOrder
    kind: SortOrder
    title: SortOrder
  }

  input CreateTemplateInput {
    name: String!
    title: String!
    description: String
    kind: TemplateKind
    config: JSON
  }

  input UpdateTemplateInput {
    title: String
    description: String
    kind: TemplateKind
    config: JSON
  }

  type Mutation {
    createTemplate(input: CreateTemplateInput!): Template! @requireAuth
    updateTemplate(id: Int!, input: UpdateTemplateInput!): Template!
      @requireAuth
    deleteTemplate(id: Int!): Template! @requireAuth
  }
`
