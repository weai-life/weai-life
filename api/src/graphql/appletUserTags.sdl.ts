export const schema = gql`
  type AppletUserTag {
    id: Int!
    appletUser: AppletUser!
    appletUserId: Int!
    tag: Tag!
    tagId: Int!
  }

  type Query {
    appletUserTags(appletId: Int!): [AppletUserTag!]! @requireAuth
    appletUserTag(id: Int!): AppletUserTag @requireAuth
  }

  input UpdateAppletUserTagInput {
    appletUserId: Int
    tagId: Int
  }

  type Mutation {
    createAppletUserTag(name: String!): AppletUserTag! @requireAuth
    updateAppletUserTag(
      id: Int!
      input: UpdateAppletUserTagInput!
    ): AppletUserTag! @requireAuth
    deleteAppletUserTag(id: Int!): AppletUserTag! @requireAuth
  }
`
