export const schema = gql`
  type ToolUser {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    store: JSON!
    tool: Tool
    toolId: Int
    user: User
    userId: Int
  }

  type ToolAndUser {
    id: Int
    toolId: Int!
    tool: Tool!
    user: User
    userId: Int
    store: JSON
  }

  type Query {
    toolUsers: [ToolUser!]! @requireAuth
    usedTools: [ToolUser!]! @requireAuth
    toolUser(name: String!): ToolAndUser @skipAuth
  }

  input CreateToolUserInput {
    store: JSON!
    toolId: Int
    userId: Int
  }

  input UpdateToolUserInput {
    store: JSON
    toolId: Int
    userId: Int
  }

  type Mutation {
    createToolUser(input: CreateToolUserInput!): ToolUser! @requireAuth
    updateToolUser(id: Int!, input: UpdateToolUserInput!): ToolUser!
      @requireAuth
    deleteToolUser(id: Int!): ToolUser! @requireAuth
  }
`
