export const schema = gql`
  type GroupRole {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    description: String
    groupId: Int!
    group: Group!
    users: [User!]!
    permissions: [Permission!]!
  }

  type Query {
    groupRoles(
      where: GroupRolesWhereInput!
      orderBy: GroupRolesOrderByInput
    ): [GroupRole!]! @requireAuth
    groupRole(id: Int!): GroupRole @requireAuth
  }

  input GroupRolesWhereInput {
    groupId: Int
    name: StringFilter
  }

  input GroupRolesOrderByInput {
    id: IntFilter
    groupId: IntFilter
    name: StringFilter
  }

  input CreateGroupRoleInput {
    name: String!
    description: String
    groupId: Int!
    permissionIds: [Int!]!
    userIds: [Int!]
  }

  input UpdateGroupRoleInput {
    name: String
    description: String
    permissionIds: [Int!]
  }

  type Mutation {
    createGroupRole(input: CreateGroupRoleInput!): GroupRole! @requireAuth
    updateGroupRole(id: Int!, input: UpdateGroupRoleInput!): GroupRole!
      @requireAuth
    deleteGroupRole(id: Int!): GroupRole! @requireAuth
    addUsersToGroupRole(groupRoleId: Int!, userIds: [Int!]!): Boolean!
      @requireAuth
    removeUsersFromGroupRole(groupRoleId: Int!, userIds: [Int!]!): Boolean!
      @requireAuth
  }
`
