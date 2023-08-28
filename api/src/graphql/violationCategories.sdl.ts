export const schema = gql`
  type ViolationCategory {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
  }

  type Query {
    violationCategories: [ViolationCategory!]! @requireAuth
    violationCategory(id: Int!): ViolationCategory @requireAuth
  }

  input CreateViolationCategoryInput {
    name: String!
  }

  input UpdateViolationCategoryInput {
    name: String
  }

  type Mutation {
    createViolationCategory(
      input: CreateViolationCategoryInput!
    ): ViolationCategory! @requireAuth
    updateViolationCategory(
      id: Int!
      input: UpdateViolationCategoryInput!
    ): ViolationCategory! @requireAuth
    deleteViolationCategory(id: Int!): ViolationCategory! @requireAuth
  }
`
