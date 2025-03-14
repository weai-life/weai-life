export const schema = gql`
  type Connection {
    id: Int!
    senderId: Int!
    receiverId: Int!
    status: ConnectionStatus!
    remark: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    sender: User!
    receiver: User!
  }

  enum ConnectionStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  type Query {
    connections: [Connection!]! @requireAuth
    sentConnections: [Connection!]! @requireAuth
    receivedConnections: [Connection!]! @requireAuth
    connection(id: Int!): Connection @requireAuth
  }

  input CreateConnectionInput {
    senderId: Int!
    receiverId: Int!
    status: ConnectionStatus!
    remark: String!
  }

  input UpdateConnectionInput {
    senderId: Int
    receiverId: Int
    status: ConnectionStatus
    remark: String
  }

  type Mutation {
    createConnectionByEmail(email: String!): Connection! @requireAuth
    acceptConnection(id: Int!): Connection! @requireAuth
    createConnection(input: CreateConnectionInput!): Connection! @requireAuth
    updateConnection(id: Int!, input: UpdateConnectionInput!): Connection!
      @requireAuth
    deleteConnection(id: Int!): Connection! @requireAuth
  }
`
