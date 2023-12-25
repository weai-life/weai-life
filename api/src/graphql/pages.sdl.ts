export const schema = gql`
  type Page {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String!
    description: String
    avatarUrl: String
    owner: User!
    ownerId: Int!
    store: JSON!
    links: [Link]!
  }

  type Query {
    pages: [Page!]! @requireAuth
    page(id: Int!): Page @requireAuth
  }

  input CreatePageInput {
    title: String!
    description: String
    avatarUrl: String
    ownerId: Int!
    store: JSON!
  }

  input UpdatePageInput {
    title: String
    description: String
    avatarUrl: String
    ownerId: Int
    store: JSON
  }

  type Mutation {
    createPage(input: CreatePageInput!): Page! @requireAuth
    updatePage(id: Int!, input: UpdatePageInput!): Page! @requireAuth
    deletePage(id: Int!): Page! @requireAuth
  }
`
