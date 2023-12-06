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

  type AppletAndUser {
    id: Int
    appletId: Int!
    applet: Applet!
    user: User
    userId: Int
    store: JSON
  }

  type Query {
    appletUsers: [AppletUser!]! @requireAuth
    appletUser(name: String!): AppletAndUser @skipAuth
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
