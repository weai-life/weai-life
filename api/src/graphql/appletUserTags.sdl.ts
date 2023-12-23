export const schema = gql`
  type AppletUserTag {
    id: Int!
    appletUser: AppletUser!
    appletUserId: Int!
    tag: Tag!
    tagId: Int!
  }

  type Query {
    appletUserTags: [AppletUserTag!]! @requireAuth
    appletUserTag(id: Int!): AppletUserTag @requireAuth
  }

  input CreateAppletUserTagInput {
    appletUserId: Int!
    tagId: Int!
  }

  input UpdateAppletUserTagInput {
    appletUserId: Int
    tagId: Int
  }

  type Mutation {
    createAppletUserTag(input: CreateAppletUserTagInput!): AppletUserTag!
      @requireAuth
    updateAppletUserTag(
      id: Int!
      input: UpdateAppletUserTagInput!
    ): AppletUserTag! @requireAuth
    deleteAppletUserTag(id: Int!): AppletUserTag! @requireAuth
  }
`
