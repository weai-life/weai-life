export const schema = gql`
  type Link {
    id: Int!
    pageId: Int!
    page: Page!
    title: String!
    url: String!
    description: String
    icon: String
    store: JSON!
  }

  type Query {
    links: [Link!]! @requireAuth
    link(id: Int!): Link @requireAuth
  }

  input CreateLinkInput {
    pageId: Int!
    title: String!
    url: String!
    description: String
    icon: String
    store: JSON
  }

  input UpdateLinkInput {
    pageId: Int
    title: String
    url: String
    description: String
    icon: String
    store: JSON
  }

  type Mutation {
    createLink(input: CreateLinkInput!): Link! @requireAuth
    updateLink(id: Int!, input: UpdateLinkInput!): Link! @requireAuth
    deleteLink(id: Int!): Link! @requireAuth
  }
`
