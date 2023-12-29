export const schema = gql`
  type ToolUserTag {
    id: Int!
    toolUser: ToolUser!
    toolUserId: Int!
    tag: Tag!
    tagId: Int!
  }

  type Query {
    toolUserTags(toolId: Int!): [ToolUserTag!]! @requireAuth
    toolUserTag(id: Int!): ToolUserTag @requireAuth
  }

  input UpdateToolUserTagInput {
    toolUserId: Int
    tagId: Int
  }

  type Mutation {
    createToolUserTag(name: String!, toolId: Int!): ToolUserTag! @requireAuth
    updateToolUserTag(id: Int!, input: UpdateToolUserTagInput!): ToolUserTag!
      @requireAuth
    deleteToolUserTag(id: Int!): ToolUserTag! @requireAuth
  }
`
