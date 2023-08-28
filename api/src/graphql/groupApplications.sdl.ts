export const schema = gql`
  type GroupApplication {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    groupId: Int!
    userId: Int!
    group: Group!
    user: User!
    content: String!
    status: GroupApplicationStatus!
    rejectReason: String
    reviewUserId: Int
    reviewUser: User
  }

  enum GroupApplicationStatus {
    PENDING
    APPROVED
    REJECTED
  }

  type PagedGroupApplication {
    data: [GroupApplication!]!
    hasNext: Boolean!
  }

  input GroupApplicationsWhereInput {
    groupId: Int
  }

  input GroupApplicationsOrderByInput {
    id: SortOrder
  }

  type Query {
    myGroupApplications(
      page: Int
      pageSize: Int
      where: GroupApplicationsWhereInput
      orderBy: GroupApplicationsOrderByInput
    ): PagedGroupApplication! @requireAuth
    groupApplications(
      page: Int
      pageSize: Int
      where: GroupApplicationsWhereInput
      orderBy: GroupApplicationsOrderByInput
    ): PagedGroupApplication! @requireAuth
    groupApplication(id: Int!): GroupApplication @requireAuth
  }

  input ApplyToJoinGroupInput {
    groupId: Int!
    """
    申请内容描述
    """
    content: String!
  }

  input RejectGroupApplicationInput {
    rejectReason: String
  }

  type Mutation {
    applyToJoinGroup(input: ApplyToJoinGroupInput!): GroupApplication!
      @requireAuth
    rejectGroupApplication(
      id: Int!
      input: RejectGroupApplicationInput!
    ): GroupApplication! @requireAuth
    approveGroupApplication(id: Int!): GroupApplication! @requireAuth
  }
`
