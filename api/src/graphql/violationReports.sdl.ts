export const schema = gql`
  type ViolationReport {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    violationCategory: ViolationCategory!
    reporterId: Int!
    reporter: User!
    violationCategoryId: Int!
    content: String
    post: Post!
    postId: Int!
  }

  type PagedViolationReports {
    data: [ViolationReport!]!
    hasNext: Boolean!
  }

  input ViolationReportsWhereInput {
    reporterId: Int
    violationCategoryId: Int
    content: StringFilter
  }

  input ViolationReportsOrderByInput {
    id: SortOrder
    updatedAt: SortOrder
  }

  type Query {
    violationReports(
      page: Int
      pageSize: Int
      where: ViolationReportsWhereInput
      orderBy: ViolationReportsOrderByInput
    ): PagedViolationReports! @requireAuth
    violationReport(id: Int!): ViolationReport @requireAuth
  }

  input CreateViolationReportInput {
    violationCategoryId: Int!
    content: String
    postId: Int!
  }

  input UpdateViolationReportInput {
    violationCategoryId: Int
    content: String
  }

  type Mutation {
    createViolationReport(input: CreateViolationReportInput!): ViolationReport!
      @requireAuth
    updateViolationReport(
      id: Int!
      input: UpdateViolationReportInput!
    ): ViolationReport! @requireAuth
    deleteViolationReport(id: Int!): ViolationReport! @requireAuth
  }
`
