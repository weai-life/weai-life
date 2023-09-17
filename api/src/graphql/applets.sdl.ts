export const schema = gql`
  type Applet {
    id: Int!
    name: String!
    title: String!
    description: String
    website: String
    icon: String
    posts: [Post]!
    channels: [Channel]!
  }

  type Query {
    applets: [Applet!]! @skipAuth
    applet(name: String!): Applet @skipAuth
  }

  input CreateAppletInput {
    name: String!
    title: String!
    description: String
    icon: String
  }

  input UpdateAppletInput {
    name: String
    title: String
    description: String
    icon: String
  }

  type Mutation {
    createApplet(input: CreateAppletInput!): Applet! @requireAuth
    updateApplet(id: Int!, input: UpdateAppletInput!): Applet! @requireAuth
    deleteApplet(id: Int!): Applet! @requireAuth
  }
`
