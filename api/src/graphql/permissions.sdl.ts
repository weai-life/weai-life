export const schema = gql`
  type Permission {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    key: String!
    name: String!
    description: String
  }

  input PermissionsWhereInput {
    name: StringFilter
  }

  input PermissionsOrderByInput {
    id: SortOrder
    updatedAt: SortOrder
  }

  type Query {
    permissions(
      where: PermissionsWhereInput
      orderBy: PermissionsOrderByInput
    ): [Permission!]! @requireAuth
    permission(id: Int!): Permission @requireAuth
  }

  input CreatePermissionInput {
    name: String!
    description: String
  }

  input UpdatePermissionInput {
    name: String
    description: String
  }

  type Mutation {
    createPermission(input: CreatePermissionInput!): Permission! @requireAuth
    updatePermission(id: Int!, input: UpdatePermissionInput!): Permission!
      @requireAuth
    deletePermission(id: Int!): Permission! @requireAuth
  }
`
