export const schema = gql`
  type Tool {
    id: Int!
    name: String!
    title: String!
    description: String
    url: String
    icon: String
    posts: [Post]!
    channels: [Channel]!
  }

  type Query {
    tools: [Tool!]! @skipAuth
    tool(name: String!): Tool @skipAuth
  }

  input CreateToolInput {
    name: String!
    title: String!
    description: String
    icon: String
  }

  input UpdateToolInput {
    name: String
    title: String
    description: String
    icon: String
  }

  type Mutation {
    createTool(input: CreateToolInput!): Tool! @requireAuth
    updateTool(id: Int!, input: UpdateToolInput!): Tool! @requireAuth
    deleteTool(id: Int!): Tool! @requireAuth
  }
`
