export const schema = gql`
  type Collaborator {
    id: Int!
    post: Post!
    postId: Int!
    userId: Int!
    user: User!
  }

  type Query {
    collaborators: [Collaborator!]! @requireAuth
    collaborator(id: Int!): Collaborator @requireAuth
  }

  input CreateCollaboratorInput {
    postId: Int!
    userId: Int!
  }

  input UpdateCollaboratorInput {
    postId: Int
    userId: Int
  }

  type Mutation {
    createCollaborator(input: CreateCollaboratorInput!): Collaborator!
      @requireAuth
    updateCollaborator(
      id: Int!
      input: UpdateCollaboratorInput!
    ): Collaborator! @requireAuth
    deleteCollaborator(id: Int!): Collaborator! @requireAuth
  }
`
