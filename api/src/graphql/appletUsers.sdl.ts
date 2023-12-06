export const schema = gql`
  type AppletUser {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    store: JSON!
    applet: Applet
    appletId: Int
    user: User
    userId: Int
  }

  type Query {
    appletUsers: [AppletUser!]! @requireAuth
    appletUser(id: Int!): AppletUser @requireAuth
  }

  input CreateAppletUserInput {
    store: JSON!
    appletId: Int
    userId: Int
  }

  input UpdateAppletUserInput {
    store: JSON
    appletId: Int
    userId: Int
  }

  type Mutation {
    createAppletUser(input: CreateAppletUserInput!): AppletUser! @requireAuth
    updateAppletUser(id: Int!, input: UpdateAppletUserInput!): AppletUser!
      @requireAuth
    deleteAppletUser(id: Int!): AppletUser! @requireAuth
  }
`
