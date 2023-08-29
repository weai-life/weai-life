export const schema = gql`
  type Applet {
    id: Int!
    name: String!
    title: String!
    description: String
    posts: [Post]!
    channels: [Channel]!
  }

  type Query {
    applets: [Applet!]! @requireAuth
    applet(id: Int!): Applet @requireAuth
  }

  input CreateAppletInput {
    name: String!
    title: String!
    description: String
  }

  input UpdateAppletInput {
    name: String
    title: String
    description: String
  }

  type Mutation {
    createApplet(input: CreateAppletInput!): Applet! @requireAuth
    updateApplet(id: Int!, input: UpdateAppletInput!): Applet! @requireAuth
    deleteApplet(id: Int!): Applet! @requireAuth
  }
`
